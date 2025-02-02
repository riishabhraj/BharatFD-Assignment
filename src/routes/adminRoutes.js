"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controllers/adminController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
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
router.post("/register", adminController_js_1.register);
router.post('/login', adminController_js_1.login);
// Protected routes
router.use(auth_js_1.adminAuth); /**
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
router.get('/faqs', adminController_js_1.getFaqs);
router.put('/faqs/:id', adminController_js_1.updateFaq);
exports.default = router;
