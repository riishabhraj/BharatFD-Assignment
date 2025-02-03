import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/database';
import faqRoutes from './routes/faqRoutes';
import adminRoutes from './routes/adminRoutes';
import { setupSwagger } from './config/swagger';
import logger from "./config/logger";
import redisClient from "./config/redis";

dotenv.config();
const app = express();

// Middleware
app.use(morgan("dev", { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Routes
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);
redisClient.on('connect', () => console.log('Redis Connected Successfully'));
setupSwagger(app);

app.use('/', (req, res) => {
    res.redirect('/api-docs');
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server only if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app; // Export the app for testing
