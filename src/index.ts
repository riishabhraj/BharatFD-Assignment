import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import faqRoutes from './routes/faqRoutes';
import adminRoutes from './routes/adminRoutes';
import dotenv from 'dotenv';
import { setupSwagger } from './config/swagger';
import logger from "./config/logger";
import morgan from 'morgan'
import * as path from "node:path";
import redisClient from "./config/redis";
import redis from "./config/redis";
import mongoose from 'mongoose';

dotenv.config();
const app = express();
// Middleware
// @ts-ignore
app.use(morgan("dev", { stream: logger.stream }));
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB()

// Routes
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);
redisClient.on('connect', () => console.log('Redis Connected Successfully'));
setupSwagger(app);

app.use('/', (req, res) => {
    res.redirect('/api-docs');
});
// Swagger setup
// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
