import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected: boolean = false; // Track connection status

const connectDB = async (): Promise<void> => {
    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db');
        isConnected = true; // Set connection status to true
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
