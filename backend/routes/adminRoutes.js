const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Setup and Authentication routes
router.get('/setup-status', adminController.getSetupStatus);
router.post('/setup', adminController.setupInitialAdmin);
router.post('/login', adminController.loginAdmin);

// Protected routes (Admin only)
router.get('/profile', authMiddleware, adminController.getAdminProfile);
router.get('/stats', authMiddleware, adminController.getStats);

module.exports = router;
