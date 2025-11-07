const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { isAuthenticated } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// All export routes require authentication
router.use(isAuthenticated);

/**
 * @swagger
 * /api/export/tasks:
 *   get:
 *     tags: [Export]
 *     summary: Export tasks
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, markdown]
 *           default: json
 *       - in: query
 *         name: repository_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exported tasks
 */
router.get('/tasks', asyncHandler(exportController.exportTasks));

/**
 * @swagger
 * /api/export/repository/{id}:
 *   get:
 *     tags: [Export]
 *     summary: Export repository data
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, markdown]
 *           default: json
 *     responses:
 *       200:
 *         description: Exported repository data
 */
router.get('/repository/:id', asyncHandler(exportController.exportRepository));

module.exports = router;
