const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public endpoints so users can browse scrap even if unauthenticated,
// or authenticated (though both work).
router.get('/categories', dataController.getCategories);
router.get('/items', dataController.getScrapItems);
router.get('/time-slots', dataController.getTimeSlots);

module.exports = router;
