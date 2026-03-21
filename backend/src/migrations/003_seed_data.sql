-- Seed default scrap categories
INSERT INTO scrap_categories (id, name, icon_name, icon_bg, card_bg) VALUES
(1, 'Paper', 'FileText', '#E0F2FE', '#F0F9FF'),
(2, 'Plastic', 'Trash2', '#DCFCE7', '#F0FDF4'),
(3, 'Metal', 'Box', '#FEE2E2', '#FEF2F2'),
(4, 'Electronics', 'Cpu', '#F3E8FF', '#FAF5FF'),
(5, 'Glass', 'GlassWater', '#FEF3C7', '#FFFBEB')
ON CONFLICT (id) DO NOTHING;

-- Seed default scrap items
INSERT INTO scrap_items (category_id, name, measurement_type, base_price) VALUES
(1, 'Newspaper', 'weight', 12.00),
(1, 'Cardboard', 'weight', 8.00),
(1, 'Books/Magazines', 'weight', 10.00),
(2, 'Plastic Bottles', 'weight', 15.00),
(2, 'Soft Plastic', 'weight', 5.00),
(3, 'Iron/Steel', 'weight', 25.00),
(3, 'Copper', 'weight', 450.00),
(3, 'Aluminum', 'weight', 105.00),
(4, 'E-Waste', 'weight', 20.00),
(4, 'Small Appliances', 'quantity', 50.00),
(5, 'Glass Bottles', 'weight', 2.00),
(5, 'Broken Glass', 'weight', 1.00)
ON CONFLICT (category_id, name) DO NOTHING;

-- Seed default time slots
INSERT INTO time_slots (slot_text, is_active) VALUES
('09:00 AM - 12:00 PM', TRUE),
('12:00 PM - 03:00 PM', TRUE),
('03:00 PM - 06:00 PM', TRUE),
('06:00 PM - 08:00 PM', TRUE)
ON CONFLICT (slot_text) DO NOTHING;
