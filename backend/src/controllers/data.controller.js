const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scrap_categories ORDER BY created_at ASC');
    
    // We want the frontend to receive an array named 'categories'
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.getScrapItems = async (req, res) => {
  try {
    // We want to fetch all items, and also include their category name for easy grouping
    const query = `
      SELECT 
        i.id,
        i.name,
        i.measurement_type,
        i.base_price,
        c.name as category_name
      FROM scrap_items i
      JOIN scrap_categories c ON i.category_id = c.id
      ORDER BY c.created_at ASC, i.created_at ASC
    `;
    
    const result = await db.query(query);
    
    // Group the items by category name just like the existing SCRAP_DATA object structure
    const groupedItems = {};
    
    // Also build a config object mapping item names to measurement type like SCRAP_CONFIG
    const config = {};
    
    result.rows.forEach(item => {
      // Grouping
      if (!groupedItems[item.category_name]) {
        groupedItems[item.category_name] = [];
      }
      groupedItems[item.category_name].push(item.name);
      
      // Config mapping (includes measurement type and base price)
      config[item.name] = {
        type: item.measurement_type,
        price: parseFloat(item.base_price) || 0
      };
    });

    res.json({ 
      scrapData: groupedItems,
      scrapConfig: config 
    });
  } catch (error) {
    console.error('Error fetching scrap items:', error);
    res.status(500).json({ error: 'Failed to fetch scrap items' });
  }
};

exports.getTimeSlots = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM time_slots WHERE is_active = TRUE ORDER BY created_at ASC');
    res.json({ timeSlots: result.rows });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Failed to fetch time slots' });
  }
};
