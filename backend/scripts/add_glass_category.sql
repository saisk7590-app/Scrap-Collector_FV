-- ============================================
-- SCRIPT: ADD GLASS CATEGORY & ITEMS
-- Run this in your PostgreSQL (scrap_collector DB)
-- ============================================

-- 1. Add the Category
-- The icon_name 'GlassWater' is from lucide-react-native
INSERT INTO scrap_categories (name, icon_name, icon_bg, card_bg)
VALUES ('Glass', 'GlassWater', '#E0F2FE', '#F0F9FF')
ON CONFLICT (name) DO NOTHING;

-- 2. Add the Items (linked to Glass category)
INSERT INTO scrap_items (category_id, name, measurement_type, base_price)
SELECT id, 'Glass Bottles', 'weight', 2.00 FROM scrap_categories WHERE name = 'Glass'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO scrap_items (category_id, name, measurement_type, base_price)
SELECT id, 'Broken Glass', 'weight', 1.00 FROM scrap_categories WHERE name = 'Glass'
ON CONFLICT (category_id, name) DO NOTHING;

-- Verification query
-- SELECT c.name as category, i.name as item, i.base_price 
-- FROM scrap_items i 
-- JOIN scrap_categories c ON i.category_id = c.id 
-- WHERE c.name = 'Glass';
