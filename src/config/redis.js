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
exports.delAsync = exports.setAsync = exports.getAsync = void 0;
const redis_1 = require("redis");
const util_1 = require("util");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Connected Successfully'));
redisClient.on('reconnecting', () => console.log('Redis Reconnecting...'));
// Initialize Redis connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
}))();
exports.getAsync = (0, util_1.promisify)(redisClient.get).bind(redisClient);
exports.setAsync = (0, util_1.promisify)(redisClient.set).bind(redisClient);
exports.delAsync = (0, util_1.promisify)(redisClient.del).bind(redisClient);
exports.default = redisClient;
