import { Request, Response } from 'express';
import Faq from '../models/Faq';
import translationService from '../services/translationService';
import { setCache } from '../middleware/cache';
import { ResponseHandler } from '../utils/responseHandler';
import logger from "../config/logger";

export const getFaqs = async (req: Request, res: Response) => {
    try {
        const lang = req.query.lang as string || 'en';
        const faqs = await Faq.find().sort({ createdAt: -1 });

        if (!faqs.length) {
            return ResponseHandler.success(res, [], 'No FAQs found');
        }

        const translatedFaqs = faqs.map(faq => ({
            id: faq._id,
            question: faq.translations[lang]?.question || faq.question,
            answer: faq.translations[lang]?.answer || faq.answer,
            createdAt: faq.createdAt
        }));
        // await setCache(res.locals.cacheKey, translatedFaqs);
        ResponseHandler.success(res, translatedFaqs, 'FAQs retrieved successfully');
    } catch (error) {
        console.error('Error in getFaqs:', error);
        ResponseHandler.error(res, 'Error retrieving FAQs');
    }
};

export const createFaq = async (req: Request, res: Response) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return ResponseHandler.error(res, 'Question and answer are required', 400);
        }

        const faq = new Faq({
            question,
            answer,
            translations: {}
        });

        const supportedLanguages = ['hi', 'bn', 'es', 'fr'];

        try {
            const translations = await Promise.all(
                supportedLanguages.map(async (lang) => {
                    const translation = await translationService.translateFaq(question, answer, lang);
                    return [lang, translation] as [string, { question: string; answer: string }];
                })
            );

            translations.forEach(([lang, translation]) => {
                faq.translations[lang] = translation;
            });
        } catch (translationError) {
            console.error('Translation error:', translationError);
            // Continue without translations if they fail
        }

        await faq.save();
        ResponseHandler.success(res, faq, 'FAQ created successfully', 201);
    } catch (error) {
        console.error('Error in createFaq:', error);
        ResponseHandler.error(res, 'Error creating FAQ');
    }
};
