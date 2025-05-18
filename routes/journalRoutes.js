const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const controller = require('../controllers/journalController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Journals
 *   description: Journal management routes
 */

/**
 * @swagger
 * /journals:
 *   post:
 *     summary: Create a new journal entry (Teacher only)
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Math homework details"
 *               published_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-20T10:00:00Z"
 *               student_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [12, 14]
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Journal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 journalId:
 *                   type: integer
 *       401:
 *         description: Unauthorized or role not allowed
 */
router.post('/', auth, role('teacher'), upload.single('attachment'), controller.createJournal);

/**
 * @swagger
 * /journals/{id}:
 *   put:
 *     summary: Update an existing journal entry (Teacher only)
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Journal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               published_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-21T10:00:00Z"
 *     responses:
 *       200:
 *         description: Journal updated successfully
 *       401:
 *         description: Unauthorized or role not allowed
 */
router.put('/:id', auth, role('teacher'), controller.updateJournal);

/**
 * @swagger
 * /journals/{id}:
 *   delete:
 *     summary: Delete a journal entry (Teacher only)
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Journal ID
 *     responses:
 *       200:
 *         description: Journal deleted successfully
 *       401:
 *         description: Unauthorized or role not allowed
 */
router.delete('/:id', auth, role('teacher'), controller.deleteJournal);

/**
 * @swagger
 * /journals/{id}/publish:
 *   post:
 *     summary: Publish a journal entry (Teacher only)
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Journal ID
 *     responses:
 *       200:
 *         description: Journal published successfully
 *       401:
 *         description: Unauthorized or role not allowed
 */
router.post('/:id/publish', auth, role('teacher'), controller.publishJournal);

/**
 * @swagger
 * /journals/feed:
 *   get:
 *     summary: Get journals feed (Published journals tagged to the student)
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journals visible to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   attachment_type:
 *                     type: string
 *                   attachment_path:
 *                     type: string
 *                   published_at:
 *                     type: string
 *                     format: date-time
 *                   created_by:
 *                     type: integer
 *                   is_published:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/feed', auth, controller.getFeed);

module.exports = router;
