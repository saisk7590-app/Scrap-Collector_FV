const pool = require('./src/config/db');

async function migrate() {
    try {
        console.log("🚀 Starting icons and images migration...");

        // 1. Add 'icon' column to 'scrap_categories'
        await pool.query(`
            ALTER TABLE scrap_categories 
            ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📦';
        `);
        console.log("✅ Added 'icon' column to scrap_categories.");

        // 2. Update existing categories with icons
        const categories = [
            { name: 'Paper', icon: '📄' },
            { name: 'Plastic', icon: '🧴' },
            { name: 'Metal', icon: '🛠️' },
            { name: 'E-Waste', icon: '💻' },
            { name: 'Glass', icon: '🍾' },
            { name: 'Rubber/Wood', icon: '🛞' }
        ];

        for (const cat of categories) {
            await pool.query(
                'UPDATE scrap_categories SET icon = $1 WHERE name = $2',
                [cat.icon, cat.name]
            );
        }
        console.log("✅ Updated category icons.");

        // 3. Add 'image_url' column to 'scrap_items'
        await pool.query(`
            ALTER TABLE scrap_items 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);
        console.log("✅ Added 'image_url' column to scrap_items.");

        console.log("🏁 Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrate();
