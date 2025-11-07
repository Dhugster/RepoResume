const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// All user routes require authentication
router.use(isAuthenticated);

/**
 * @swagger
 * /api/users/settings:
 *   get:
 *     tags: [Users]
 *     summary: Get user settings
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User settings
 */
router.get('/settings', asyncHandler(userController.getSettings));

/**
 * @swagger
 * /api/users/settings:
 *   put:
 *     tags: [Users]
 *     summary: Update user settings
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/settings', asyncHandler(userController.updateSettings));

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     tags: [Users]
 *     summary: Get user statistics
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 */
router.get('/stats', asyncHandler(userController.getStatistics));

module.exports = router;
