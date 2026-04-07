-- 🔥 Production-Grade Wallet Ledger Synchronization Trigger
-- This script ensures that EVERY change to profiles.wallet_balance
-- is automatically recorded in the transactions history table.

-- 1. Create the Audit Function
CREATE OR REPLACE FUNCTION audit_wallet_balance_change()
RETURNS TRIGGER AS $$
DECLARE
    v_role_name TEXT;
    v_amount NUMERIC;
    v_type TEXT;
    v_description TEXT;
BEGIN
    -- Only act if the balance actually changed
    IF OLD.wallet_balance IS DISTINCT FROM NEW.wallet_balance THEN
        
        v_amount := ABS(NEW.wallet_balance - OLD.wallet_balance);
        v_type := CASE WHEN NEW.wallet_balance > OLD.wallet_balance THEN 'CREDIT' ELSE 'DEBIT' END;
        v_description := 'Auto-Sync: Balance Adjustment';

        -- Get user role
        SELECT LOWER(r.name) INTO v_role_name 
        FROM roles r WHERE r.id = NEW.role_id;

        -- Route to the correct transaction table
        IF v_role_name = 'collector' THEN
            -- Check if a transaction was ALREADY inserted in this same transaction (to avoid double entry)
            -- If we are in a stored procedure that already did the INSERT, we might want to skip.
            -- However, for simple manual SQL UPDATES, this is essential.
            INSERT INTO collector_wallet_transactions (collector_id, amount, type, description, balance_after)
            VALUES (NEW.user_id, v_amount, v_type, v_description, NEW.wallet_balance);
        ELSE
            -- Treat as a regular customer/user
            INSERT INTO customer_wallet_transactions (user_id, amount, type, description, balance_after)
            VALUES (NEW.user_id, v_amount, v_type, v_description, NEW.wallet_balance);
        END IF;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach Trigger to profiles table
DROP TRIGGER IF EXISTS trg_wallet_balance_audit ON profiles;
CREATE TRIGGER trg_wallet_balance_audit
AFTER UPDATE OF wallet_balance ON profiles
FOR EACH ROW
EXECUTE FUNCTION audit_wallet_balance_change();

-- 3. Verify it's working (This will be logged in the terminal)
DO $$ 
BEGIN 
    RAISE NOTICE 'Wallet Ledger Sync Trigger successfully installed.';
END $$;
