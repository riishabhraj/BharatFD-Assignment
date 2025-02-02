import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Faq from '../models/Faq';
import { ResponseHandler } from '../utils/responseHandler';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body;
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            return ResponseHandler.badRequest(res, 'Username already exists');
        }

        const newAdmin = new Admin({ username, password, email });
        await newAdmin.save();


        ResponseHandler.success(res,"", 'Registration successful');
    } catch (error) {
        ResponseHandler.error(res, 'Registration failed');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !(await admin.comparePassword(password))) {
            return ResponseHandler.unauthorized(res, 'Invalid credentials');
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        ResponseHandler.success(res, { token }, 'Login successful');
    } catch (error) {
        ResponseHandler.error(res, 'Login failed');
    }
};

export const getFaqs = async (req: Request, res: Response) => {
    try {
        const faqs = await Faq.find().sort({ createdAt: -1 });
        ResponseHandler.success(res, faqs, 'FAQs retrieved successfully');
    } catch (error) {
        ResponseHandler.error(res, 'Error retrieving FAQs');
    }
};

export const updateFaq = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { question, answer, htmlContent } = req.body;

        const faq = await Faq.findById(id);
        if (!faq) {
            return ResponseHandler.notFound(res, 'FAQ not found');
        }

        faq.question = question;
        faq.answer = answer;
        // Store HTML content from WYSIWYG editor
        if (htmlContent) {
            faq.answer = htmlContent;
        }

        await faq.save();
        ResponseHandler.success(res, faq, 'FAQ updated successfully');
    } catch (error) {
        ResponseHandler.error(res, 'Error updating FAQ');
    }
};
