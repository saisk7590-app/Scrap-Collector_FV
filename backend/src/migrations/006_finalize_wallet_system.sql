-- 1. Add balance_after to wallet_transactions
ALTER TABLE wallet_transactions 
ADD COLUMN IF NOT EXISTS balance_after DECIMAL(10,2);

-- 2. Add balance_after to collector_wallet_transactions (for audit consistency)
ALTER TABLE collector_wallet_transactions 
ADD COLUMN IF NOT EXISTS balance_after DECIMAL(10,2);

-- 3. Backfill balance_after for wallet_transactions
DO $$
DECLARE
    r RECORD;
    running_balance DECIMAL(10,2);
    current_user_id INTEGER := -1;
BEGIN
    FOR r IN (
        SELECT id, user_id, amount, type 
        FROM wallet_transactions 
        ORDER BY user_id, created_at ASC, id ASC
    ) LOOP
        IF r.user_id <> current_user_id THEN
            current_user_id := r.user_id;
            running_balance := 0;
        END IF;

        IF r.type = 'CREDIT' THEN
            running_balance := running_balance + r.amount;
        ELSE
            running_balance := running_balance - r.amount;
        END IF;

        UPDATE wallet_transactions 
        SET balance_after = running_balance 
        WHERE id = r.id;
    END LOOP;
END $$;

-- 4. Backfill balance_after for collector_wallet_transactions
DO $$
DECLARE
    r RECORD;
    running_balance DECIMAL(10,2);
    current_collector_id INTEGER := -1;
BEGIN
    FOR r IN (
        SELECT id, collector_id, amount, type 
        FROM collector_wallet_transactions 
        ORDER BY collector_id, created_at ASC, id ASC
    ) LOOP
        IF r.collector_id <> current_collector_id THEN
            current_collector_id := r.collector_id;
            running_balance := 0;
        END IF;

        IF r.type = 'CREDIT' THEN
            running_balance := running_balance + r.amount;
        ELSE
            running_balance := running_balance - r.amount;
        END IF;

        UPDATE collector_wallet_transactions 
        SET balance_after = running_balance 
        WHERE id = r.id;
    END LOOP;
END $$;
