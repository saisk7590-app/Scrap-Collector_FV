const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

const normalizeAmount = (value) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
        return null;
    }

    const rounded = Number(parsed.toFixed(2));
    return rounded > 0 ? rounded : null;
};

const ensureLegacyWalletTransaction = async (client, userId, balance) => {
    const numericBalance = Number(balance || 0);

    if (numericBalance <= 0) {
        return;
    }

    await client.query(
        `INSERT INTO wallet_transactions (user_id, amount, type, description)
         SELECT $1, $2, 'CREDIT', 'Initial balance'
         WHERE NOT EXISTS (
             SELECT 1
             FROM wallet_transactions
             WHERE user_id = $1
         )`,
        [userId, numericBalance]
    );
};

const getWalletBalance = async (client, userId, { forUpdate = false } = {}) => {
    const lockClause = forUpdate ? ' FOR UPDATE' : '';
    const result = await client.query(
        `SELECT wallet_balance
         FROM profiles
         WHERE user_id = $1${lockClause}`,
        [userId]
    );

    if (result.rows.length === 0) {
        const error = new Error('Wallet profile not found');
        error.statusCode = 404;
        throw error;
    }

    return Number(result.rows[0].wallet_balance || 0);
};

exports.getWalletTransactions = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;

        await client.query('BEGIN');

        const balance = await getWalletBalance(client, userId);
        await ensureLegacyWalletTransaction(client, userId, balance);

        const txResult = await client.query(
            `SELECT id, user_id, amount, type, description, created_at
             FROM wallet_transactions
             WHERE user_id = $1
             ORDER BY created_at DESC, id DESC`,
            [userId]
        );

        await client.query('COMMIT');

        return ApiResponse.success(res, 'Wallet transactions retrieved', {
            balance,
            transactions: txResult.rows,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

exports.withdrawFromWallet = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const amount = normalizeAmount(req.body?.amount);

        if (!amount) {
            return ApiResponse.error(res, 'A valid withdrawal amount is required', 400);
        }

        await client.query('BEGIN');

        const currentBalance = await getWalletBalance(client, userId, { forUpdate: true });

        if (currentBalance < amount) {
            await client.query('ROLLBACK');
            return ApiResponse.error(res, 'Insufficient balance', 400);
        }

        await ensureLegacyWalletTransaction(client, userId, currentBalance);

        const balanceResult = await client.query(
            `UPDATE profiles
             SET wallet_balance = wallet_balance - $1,
                 updated_at = NOW()
             WHERE user_id = $2
             RETURNING wallet_balance`,
            [amount, userId]
        );

        const transactionResult = await client.query(
            `INSERT INTO wallet_transactions (user_id, amount, type, description)
             VALUES ($1, $2, 'DEBIT', 'Withdrawal')
             RETURNING id, user_id, amount, type, description, created_at`,
            [userId, amount]
        );

        await client.query('COMMIT');

        return ApiResponse.success(res, 'Withdrawal completed successfully', {
            balance: Number(balanceResult.rows[0].wallet_balance || 0),
            transaction: transactionResult.rows[0],
        });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

/* =======================
   GET COLLECTOR WALLET HISTORY
======================= */
exports.getWalletHistory = async (req, res, next) => {
    try {
        const collectorId = req.user.id;

        if (req.user.role !== 'collector' && req.user.role !== 'admin') {
            return ApiResponse.error(res, 'Unauthorized access', 403);
        }

        const profileResult = await pool.query(
            'SELECT wallet_balance FROM profiles WHERE user_id = $1',
            [collectorId]
        );
        const balance = profileResult.rows.length > 0 ? profileResult.rows[0].wallet_balance : 0;

        const txResult = await pool.query(
            `SELECT *
             FROM collector_wallet_transactions
             WHERE collector_id = $1
             ORDER BY created_at DESC`,
            [collectorId]
        );

        return ApiResponse.success(res, 'Wallet history retrieved', {
            balance,
            transactions: txResult.rows,
        });
    } catch (err) {
        next(err);
    }
};

/* =======================
   ADD FUNDS TO COLLECTOR WALLET (Admin Only - Simulation)
======================= */
exports.addFunds = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const { collectorId, amount, description } = req.body;
        const normalizedAmount = normalizeAmount(amount);

        if (!collectorId || !normalizedAmount) {
            return ApiResponse.error(res, 'Valid Collector ID and positive amount required', 400);
        }

        await client.query('BEGIN');

        const txResult = await client.query(
            `INSERT INTO collector_wallet_transactions (collector_id, amount, type, description)
             VALUES ($1, $2, 'CREDIT', $3)
             RETURNING *`,
            [collectorId, normalizedAmount, description || 'Funds added by Admin']
        );

        await client.query(
            `INSERT INTO wallet_transactions (user_id, amount, type, description)
             VALUES ($1, $2, 'CREDIT', $3)`,
            [collectorId, normalizedAmount, description || 'Funds added by Admin']
        );

        await client.query(
            `UPDATE profiles
             SET wallet_balance = wallet_balance + $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [normalizedAmount, collectorId]
        );

        await client.query('COMMIT');

        return ApiResponse.success(res, 'Funds added successfully', {
            transaction: txResult.rows[0],
        });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};
