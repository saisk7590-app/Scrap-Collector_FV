const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const pickupController = require('../controllers/pickup.controller');
const profileController = require('../controllers/profile.controller');
const scrapController = require('../controllers/scrap.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadProfileImage } = require('../middlewares/upload.middleware');

// ✅ Health Check
router.get('/health', (req, res) => res.json({ status: 'Backend is healthy', timestamp: new Date() }));

// =====================
// DATA ROUTES (Public)
// =====================
const dataRoutes = require('./data.routes');
router.use('/data', dataRoutes);

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
router.post('/profile/photo', authMiddleware, uploadProfileImage.single('profileImage'), profileController.uploadProfilePhoto);
router.delete('/profile/photo', authMiddleware, profileController.removeProfilePhoto);

// =====================
// PICKUP ROUTES (Protected)
// =====================
router.post('/pickups/create', authMiddleware, pickupController.createPickup);
router.get('/pickups/my', authMiddleware, pickupController.getMyPickups);
router.get('/pickups/today', authMiddleware, pickupController.getTodayPickups);
router.get('/pickups/history', authMiddleware, pickupController.getCollectorHistory);
router.get('/pickups/all', authMiddleware, pickupController.getAllPickups);
router.get('/pickups/:id', authMiddleware, pickupController.getPickupDetails);
router.put('/pickups/:id/status', authMiddleware, pickupController.updatePickupStatus);

// =====================
// SCRAP ROUTES (Protected)
// =====================
router.post('/scrap/create', authMiddleware, scrapController.createScrapRequest);
router.get('/scrap/my', authMiddleware, scrapController.getMyScrapRequests);

// =====================
// ADDRESS ROUTES (Protected)
// =====================
router.use('/addresses', require('./address.routes'));

// =====================
// WALLET ROUTES (Protected)
// =====================
const walletController = require('../controllers/wallet.controller');
router.get('/wallet/transactions', authMiddleware, walletController.getWalletTransactions);
router.get('/wallet/history', authMiddleware, walletController.getWalletHistory);
router.post('/wallet/withdraw', authMiddleware, walletController.withdrawFromWallet);
router.post('/wallet/add-funds', authMiddleware, walletController.addFunds);

module.exports = router;
