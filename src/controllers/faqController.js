"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFaq = exports.getFaqs = void 0;
const Faq_1 = __importDefault(require("../models/Faq"));
const translationService_1 = __importDefault(require("../services/translationService"));
const responseHandler_1 = require("../utils/responseHandler");
const getFaqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang = req.query.lang || 'en';
        const faqs = yield Faq_1.default.find().sort({ createdAt: -1 });
        if (!faqs.length) {
            return responseHandler_1.ResponseHandler.success(res, [], 'No FAQs found');
        }
        const translatedFaqs = faqs.map(faq => {
            var _a, _b;
            return ({
                id: faq._id,
                question: ((_a = faq.translations[lang]) === null || _a === void 0 ? void 0 : _a.question) || faq.question,
                answer: ((_b = faq.translations[lang]) === null || _b === void 0 ? void 0 : _b.answer) || faq.answer,
                createdAt: faq.createdAt
            });
        });
        // await setCache(res.locals.cacheKey, translatedFaqs);
        responseHandler_1.ResponseHandler.success(res, translatedFaqs, 'FAQs retrieved successfully');
    }
    catch (error) {
        console.error('Error in getFaqs:', error);
        responseHandler_1.ResponseHandler.error(res, 'Error retrieving FAQs');
    }
});
exports.getFaqs = getFaqs;
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return responseHandler_1.ResponseHandler.error(res, 'Question and answer are required', 400);
        }
        const faq = new Faq_1.default({
            question,
            answer,
            translations: {}
        });
        const supportedLanguages = ['hi', 'bn', 'es', 'fr'];
        try {
            const translations = yield Promise.all(supportedLanguages.map((lang) => __awaiter(void 0, void 0, void 0, function* () {
                const translation = yield translationService_1.default.translateFaq(question, answer, lang);
                return [lang, translation];
            })));
            translations.forEach(([lang, translation]) => {
                faq.translations[lang] = translation;
            });
        }
        catch (translationError) {
            console.error('Translation error:', translationError);
            // Continue without translations if they fail
        }
        yield faq.save();
        responseHandler_1.ResponseHandler.success(res, faq, 'FAQ created successfully', 201);
    }
    catch (error) {
        console.error('Error in createFaq:', error);
        responseHandler_1.ResponseHandler.error(res, 'Error creating FAQ');
    }
});
exports.createFaq = createFaq;
