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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.cacheMiddleware = void 0;
const redis_js_1 = require("../config/redis.js");
const cacheMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang = req.query.lang || 'en';
        const cacheKey = `faqs:${lang}`;
        const cachedData = yield (0, redis_js_1.getAsync)(cacheKey);
        if (cachedData) {
            res.json(JSON.parse(cachedData));
            return;
        }
        res.locals.cacheKey = cacheKey;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.cacheMiddleware = cacheMiddleware;
const setCache = (key_1, data_1, ...args_1) => __awaiter(void 0, [key_1, data_1, ...args_1], void 0, function* (key, data, expiryInSeconds = 3600) {
    yield (0, redis_js_1.setAsync)(key, JSON.stringify(data), 'EX', expiryInSeconds);
});
exports.setCache = setCache;
