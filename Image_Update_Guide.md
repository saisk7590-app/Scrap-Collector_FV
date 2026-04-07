# 🖼️ PRODUCTION GUIDE: Scrap Item Images

Follow these steps to keep your app looking professional with a 100% accurate image catalog.

---

### 📍 Storage Rules (Folder Structure)
The system is designed to look in **category-specific folders**. This keeps the `uploads/` directory clean and organized.

**Root Folder**: `backend/uploads/items/`

**Subfolders**:
1.  `PAPER/` (e.g. `Newspaper.png`)
2.  `Plastics/` (e.g. `plastic-bottle.png`)
3.  `E-WASTE/` (e.g. `laptop.png`)
4.  `BATTERIES/`
5.  `GLASS/`
6.  `FERROUS METALS/`
7.  `NON-FERROUS METALS/`
8.  `RUBBERTIRES/`
9.  `TEXTILES/`
10. `WOOD/`

---

### 💾 Bulk Update Strategy (For Tomorrow 🚀)
When you download 10-15 new images, do the following:

**1. Prepare Files**: Name them clearly (e.g. `car-battery.png`).
**2. Upload**: Move them to the **correct category folder** in `backend/uploads/items/`.
**3. Update DB**: Run the following SQL in your database tool:

```sql
/* Update a single item with folder path */
UPDATE scrap_items 
SET image_url = 'BATTERIES/car-battery.png' 
WHERE name = 'Car batteries';

/* OR Update all items in a category at once if names match */
UPDATE scrap_items 
SET image_url = 'TEXTILES/' || name || '.png' 
WHERE category_id = (SELECT id FROM scrap_categories WHERE name = 'TEXTILES');
```

---

### ❓ Troubleshooting & Placeholders
- **Question Mark**: If an item has `NULL` or an empty string in `image_url`, the app **automatically** shows the `placeholder.png`.
- **Case-Sensitivity**: Ensure the extension (e.g. `.png`) matches exactly what you type in the database.
- **Spaces**: Use underscores or hyphens instead of spaces for filenames (e.g. `old_newspaper.png`).

---

### 🛠️ Verification Command
Run this in your database to see which items still need images:
```sql
SELECT i.id, i.name, c.name as category, i.image_url 
FROM scrap_items i
JOIN scrap_categories c ON i.category_id = c.id
WHERE i.image_url IS NULL OR i.image_url = '';
```
