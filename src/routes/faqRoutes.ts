import { Router } from 'express';
import { getFaqs, createFaq } from '../controllers/faqController';
import { cacheMiddleware } from '../middleware/cache';
// @ts-ignore
import { body, validationResult } from 'express-validator';

const router = Router();

const validateFaq = [
    body('question')
        .trim()
        .notEmpty()
        .withMessage('Question is required')
        .isLength({ min: 3 })
        .withMessage('Question must be at least 3 characters long'),
    body('answer')
        .trim()
        .notEmpty()
        .withMessage('Answer is required')
        .isLength({ min: 3 })
        .withMessage('Answer must be at least 3 characters long'),
    (req: any, res: any, next: any) => {
        const errors = validationResult(req);
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

router.get('/', getFaqs);
router.post('/', validateFaq, createFaq);

export default router;
