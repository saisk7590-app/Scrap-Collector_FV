const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const pickupController = require('../controllers/pickup.controller');
const profileController = require('../controllers/profile.controller');
const scrapController = require('../controllers/scrap.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// ✅ Health Check
router.get('/health', (req, res) => res.json({ status: 'Backend is healthy', timestamp: new Date() }));

// =====================
// AUTH ROUTES (Public)
// =====================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);

// =====================
// PROFILE ROUTES (Protected)
// =====================
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);

// =====================
// PICKUP ROUTES (Protected)
// =====================
router.post('/pickups/create', authMiddleware, pickupController.createPickup);
router.get('/pickups/my', authMiddleware, pickupController.getMyPickups);
router.get('/pickups/today', authMiddleware, pickupController.getTodayPickups);
router.get('/pickups/all', authMiddleware, pickupController.getAllPickups);
router.put('/pickups/:id/status', authMiddleware, pickupController.updatePickupStatus);

// =====================
// SCRAP ROUTES (Protected)
// =====================
router.post('/scrap/create', authMiddleware, scrapController.createScrapRequest);
router.get('/scrap/my', authMiddleware, scrapController.getMyScrapRequests);

module.exports = router;
