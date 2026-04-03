ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00;

INSERT INTO wallet_transactions (user_id, amount, type, description)
SELECT p.user_id, p.wallet_balance, 'CREDIT', 'Initial balance'
FROM profiles p
WHERE p.wallet_balance > 0
  AND NOT EXISTS (
    SELECT 1
    FROM wallet_transactions wt
    WHERE wt.user_id = p.user_id
  );
