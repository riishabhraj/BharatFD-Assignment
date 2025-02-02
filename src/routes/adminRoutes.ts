import { Router } from 'express';
import { login, getFaqs, updateFaq, register } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/auth.js';

const router = Router();
/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string  
 *     responses:
 *       201:
 *         description: Admin registered successfully
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 */
router.post("/register", register);
router.post('/login', login);

// Protected routes
router.use(adminAuth);/**
 * @swagger
 * /api/admin/faqs:
 *   get:
 *     summary: Retrieve a list of FAQs (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of FAQs
 * /api/admin/faqs/{id}:
 *   put:
 *     summary: Update an FAQ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 */
router.get('/faqs', getFaqs);
router.put('/faqs/:id', updateFaq);

export default router;
