-- Table list generated 2026-03-24T06:22:11.238Z
-- Database: scrap_collector

public.pickups
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

public.profiles
  1. id
  2. user_id
  3. role_id
  4. full_name
  5. phone
  6. wallet_balance
  7. address
  8. created_at
  9. updated_at
  10. alternate_phone

public.roles
  1. id
  2. name
  3. display_name
  4. created_at
  5. updated_at

public.scrap_categories
  1. id
  2. name
  3. icon_name
  4. icon_bg
  5. card_bg
  6. created_at
  7. updated_at

public.scrap_items
  1. id
  2. category_id
  3. name
  4. measurement_type
  5. base_price
  6. created_at
  7. updated_at

public.scrap_requests
  1. id
  2. user_id
  3. items
  4. total_weight
  5. status
  6. created_at
  7. updated_at

public.time_slots
  1. id
  2. slot_text
  3. is_active
  4. created_at
  5. updated_at

public.user_addresses
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

public.users
  1. id
  2. email
  3. password_hash
  4. reset_token
  5. reset_token_expires
  6. created_at
