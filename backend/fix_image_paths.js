const pool = require('./src/config/db');

async function robustImageRepair() {
    console.log("🚀 Starting FINAL Precision Image Path Repair...");
    
    const keywordMap = [
        { kw: 'newspaper', path: 'PAPER/newspaper.png' },
        { kw: 'books', path: 'PAPER/books.png' },
        { kw: 'magazines', path: 'PAPER/magazines.png' },
        { kw: 'cardboard', path: 'PAPER/cardboard boxes.png' },
        { kw: 'office', path: 'PAPER/office_paper.png' },
        { kw: 'bottle', path: 'Plastics/plastic-bottle.png' }, // Changed from 'pet' to 'bottle'
        { kw: 'bucket', path: 'Plastics/bucket.png' },
        { kw: 'crate', path: 'Plastics/crate.png' },
        { kw: 'kitchen', path: 'Plastics/kitchen containers.png' },
        { kw: 'toys', path: 'Plastics/toys.png' },
        { kw: 'laptop', path: 'E-WASTE/laptop.png' },
        { kw: 'phone', path: 'E-WASTE/mobile-phone.png' },
        { kw: 'charger', path: 'E-WASTE/charger.png' },
        { kw: 'printer', path: 'E-WASTE/printer.png' },
        { kw: 'cpu', path: 'E-WASTE/cpu.png' }
    ];

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let fixed = 0;

        for (const entry of keywordMap) {
            const res = await client.query(
                `UPDATE scrap_items SET image_url = $1 WHERE name ILIKE '%' || $2 || '%'`,
                [entry.path, entry.kw]
            );
            
            if (res.rowCount > 0) {
                console.log(`✅ FIXED: All items matching "${entry.kw}" -> ${entry.path}`);
                fixed += res.rowCount;
            } else {
                console.log(`❌ STILL MISSING: Keyword "${entry.kw}" matched 0 items.`);
            }
        }

        await client.query('COMMIT');
        console.log(`\n🎉 Success! ${fixed} records updated. All 15 images should now be visible.`);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Fatal Error:", err.message);
    } finally {
        client.release();
        process.exit();
    }
}

robustImageRepair();
