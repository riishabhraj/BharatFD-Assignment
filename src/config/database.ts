import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://username:password@localhost:27017';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;
