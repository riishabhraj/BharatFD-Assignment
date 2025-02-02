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
exports.updateFaq = exports.getFaqs = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Faq_1 = __importDefault(require("../models/Faq"));
const responseHandler_1 = require("../utils/responseHandler");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const existingAdmin = yield Admin_1.default.findOne({ username });
        if (existingAdmin) {
            return responseHandler_1.ResponseHandler.badRequest(res, 'Username already exists');
        }
        const newAdmin = new Admin_1.default({ username, password, email });
        yield newAdmin.save();
        responseHandler_1.ResponseHandler.success(res, "", 'Registration successful');
    }
    catch (error) {
        responseHandler_1.ResponseHandler.error(res, 'Registration failed');
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const admin = yield Admin_1.default.findOne({ username });
        if (!admin || !(yield admin.comparePassword(password))) {
            return responseHandler_1.ResponseHandler.unauthorized(res, 'Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        responseHandler_1.ResponseHandler.success(res, { token }, 'Login successful');
    }
    catch (error) {
        responseHandler_1.ResponseHandler.error(res, 'Login failed');
    }
});
exports.login = login;
const getFaqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield Faq_1.default.find().sort({ createdAt: -1 });
        responseHandler_1.ResponseHandler.success(res, faqs, 'FAQs retrieved successfully');
    }
    catch (error) {
        responseHandler_1.ResponseHandler.error(res, 'Error retrieving FAQs');
    }
});
exports.getFaqs = getFaqs;
const updateFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { question, answer, htmlContent } = req.body;
        const faq = yield Faq_1.default.findById(id);
        if (!faq) {
            return responseHandler_1.ResponseHandler.notFound(res, 'FAQ not found');
        }
        faq.question = question;
        faq.answer = answer;
        // Store HTML content from WYSIWYG editor
        if (htmlContent) {
            faq.answer = htmlContent;
        }
        yield faq.save();
        responseHandler_1.ResponseHandler.success(res, faq, 'FAQ updated successfully');
    }
    catch (error) {
        responseHandler_1.ResponseHandler.error(res, 'Error updating FAQ');
    }
});
exports.updateFaq = updateFaq;
