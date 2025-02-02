import mongoose, { Document, Schema } from 'mongoose';

export interface IFaq extends Document {
    question: string;
    answer: string;
    htmlContent?: string; // For WYSIWYG editor content
    translations: Record<string, {
        question: string;
        answer: string;
        htmlContent?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const FaqSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    htmlContent: {
        type: String,
        default: null
    },
    translations: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

export default mongoose.model<IFaq>('Faq', FaqSchema);
