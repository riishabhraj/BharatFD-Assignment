"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqController_js_1 = require("../controllers/faqController.js");
// @ts-ignore
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const validateFaq = [
    (0, express_validator_1.body)('question')
        .trim()
        .notEmpty()
        .withMessage('Question is required')
        .isLength({ min: 3 })
        .withMessage('Question must be at least 3 characters long'),
    (0, express_validator_1.body)('answer')
        .trim()
        .notEmpty()
        .withMessage('Answer is required')
        .isLength({ min: 3 })
        .withMessage('Answer must be at least 3 characters long'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Retrieve a list of FAQs
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Language code for filtering FAQs
 *     responses:
 *       200:
 *         description: A list of FAQs
 *   post:
 *     summary: Create a new FAQ
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
 *       201:
 *         description: FAQ created successfully
 */
router.get('/', faqController_js_1.getFaqs);
router.post('/', validateFaq, faqController_js_1.createFaq);
exports.default = router;
