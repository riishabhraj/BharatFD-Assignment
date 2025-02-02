"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const faqRoutes_1 = __importDefault(require("./routes/faqRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = require("./config/swagger");
const logger_1 = __importDefault(require("./config/logger"));
const morgan_1 = __importDefault(require("morgan"));
const redis_1 = __importDefault(require("./config/redis"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
// @ts-ignore
app.use((0, morgan_1.default)("dev", { stream: logger_1.default.stream }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connect to Database
(0, database_1.default)();
// Routes
app.use('/api/faqs', faqRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
redis_1.default.on('connect', (err) => console.error('Redis Client Error:', err));
(0, swagger_1.setupSwagger)(app);
app.use('/', (req, res) => {
    res.redirect('/api-docs');
});
// Swagger setup
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
