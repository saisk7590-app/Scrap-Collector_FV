/* ==========================================
   SCRAP COLLECTOR DATA CONSISTENCY SCRIPT
   Purpose: Sync item prices across all records for accurate reporting.
   ========================================== */

-- 1. ENSURE ALL ITEMS HAVE A BASE PRICE
-- Set sensible defaults if currently 0 or NULL
UPDATE scrap_items SET base_price = 10 WHERE name ILIKE '%paper%' AND (base_price = 0 OR base_price IS NULL);
UPDATE scrap_items SET base_price = 15 WHERE name ILIKE '%plastic%' AND (base_price = 0 OR base_price IS NULL);
UPDATE scrap_items SET base_price = 40 WHERE name ILIKE '%metal%' AND (base_price = 0 OR base_price IS NULL);
UPDATE scrap_items SET base_price = 20 WHERE name ILIKE '%glass%' AND (base_price = 0 OR base_price IS NULL);
UPDATE scrap_items SET base_price = 50 WHERE name ILIKE '%ewaste%' AND (base_price = 0 OR base_price IS NULL);

-- 2. FIX JSON DATA FOR EXISTING PICKUPS
-- This script updates the JSON storage for older pickups 
-- to include price and type so the collector app can show them correctly.

UPDATE pickups
SET items = (
    SELECT jsonb_agg(
        item || jsonb_build_object(
            'price', COALESCE((item->>'price')::numeric, si.base_price, 0),
            'type', COALESCE(item->>'type', si.measurement_type, 'weight'),
            'measurement_type', COALESCE(item->>'measurement_type', si.measurement_type, 'weight')
        )
    )
    FROM jsonb_array_elements(items) AS item
    LEFT JOIN scrap_items si ON LOWER(si.name) = LOWER(item->>'name')
)
WHERE items IS NOT NULL;

-- 3. FIX JSON DATA FOR SCRAP REQUESTS
UPDATE scrap_requests
SET items = (
    SELECT jsonb_agg(
        item || jsonb_build_object(
            'price', COALESCE((item->>'price')::numeric, si.base_price, 0),
            'type', COALESCE(item->>'type', si.measurement_type, 'weight')
        )
    )
    FROM jsonb_array_elements(items) AS item
    LEFT JOIN scrap_items si ON LOWER(si.name) = LOWER(item->>'name')
)
WHERE items IS NOT NULL;

-- 4. VERIFY DATA INTEGRITY
SELECT id, name, base_price, measurement_type, image_url FROM scrap_items;
SELECT id, items, status, amount FROM pickups ORDER BY created_at DESC LIMIT 5;
