-- ============================================
-- SCRAP COLLECTOR — DATABASE TABLE STRUCTURE
-- Generated & Cleaned (Updated)
-- ============================================

-- ============================================
-- TABLE: public.users
-- ============================================

1. id
2. email
3. password_hash
4. reset_token
5. reset_token_expires
6. created_at

-- ============================================
-- TABLE: public.roles
-- ============================================

1. id
2. name
3. display_name
4. created_at

-- ============================================
-- TABLE: public.profiles
-- ============================================

1. id
2. user_id
3. role_id
4. full_name
5. phone
6. alternate_phone
7. profile_image_url
8. wallet_balance
9. address
10. created_at
11. updated_at

-- ============================================
-- TABLE: public.pickups
-- ============================================

1. id
2. pickup_no
3. user_id
4. items
5. total_qty
6. total_weight
7. alternate_number
8. time_slot
9. city
10. status
11. amount
12. collector_id
13. created_at
14. updated_at

-- ============================================
-- TABLE: public.pickup_items
-- ============================================

1. id
2. pickup_id
3. customer_category_id
4. collector_category_id
5. customer_weight
6. collector_weight
7. final_price
8. is_modified
9. remarks
10. measurement_type
11. created_at
12. updated_at

-- ============================================
-- TABLE: public.scrap_requests
-- ============================================

1. id
2. user_id
3. items
4. total_weight
5. status
6. created_at
7. updated_at

-- ============================================
-- TABLE: public.scrap_categories
-- ============================================

1. id
2. name
3. icon_name
4. icon_bg
5. card_bg
6. is_active
7. created_at
8. updated_at

-- ============================================
-- TABLE: public.scrap_items
-- ============================================

1. id
2. category_id
3. name
4. measurement_type
5. base_price
6. is_active
7. created_at
8. updated_at

-- ============================================
-- TABLE: public.time_slots
-- ============================================

1. id
2. slot_text
3. is_active
4. created_at
5. updated_at

-- ============================================
-- TABLE: public.user_addresses
-- ============================================

1. id
2. user_id
3. type
4. house_no
5. area
6. pincode
7. landmark
8. address
9. is_default
10. created_at
11. updated_at

-- ============================================
-- TABLE: public.wallet_transactions
-- ============================================

1. id
2. user_id
3. amount
4. type
5. description
6. created_at

-- ============================================
-- TABLE: public.collector_wallet_transactions
-- ============================================

1. id
2. collector_id
3. amount
4. type
5. description
6. reference_id
7. created_at

-- ============================================
-- TABLE: public.customers
-- ============================================

1. id
2. user_id
3. profile_id
4. created_at

-- ============================================
-- TABLE: public.collectors
-- ============================================

1. id
2. user_id
3. profile_id
4. vehicle_number
5. license_number
6. is_verified
7. created_at

-- ============================================
-- TABLE: public.corporates
-- ============================================

1. id
2. user_id
3. company_name
4. contact_person
5. contact_phone
6. company_email
7. address
8. gst_number
9. created_at

-- ============================================
-- TABLE: public.government_sectors
-- ============================================

1. id
2. user_id
3. department_name
4. officer_name
5. contact_number
6. zone
7. address
8. created_at

-- ============================================
-- TABLE: public.gated_communities
-- ============================================

1. id
2. user_id
3. community_name
4. manager_name
5. manager_phone
6. total_units
7. address
8. created_at

-- ============================================
-- TOTAL TABLES: 17
-- ============================================
