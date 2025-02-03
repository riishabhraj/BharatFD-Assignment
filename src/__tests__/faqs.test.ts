import request from 'supertest';
import app from '../index';
import Faq from '../models/Faq';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { closeRedisConnection } from '../config/redis';

let mongoServer;
let token;
let faqId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const adminData = { username: 'admin', password: 'password123', email: 'admin@example.com' };
    await request(app).post('/api/admin/register').send(adminData);
    const loginRes = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'password123' });
    token = loginRes.body.data.token;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    await closeRedisConnection();
});

afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

describe('FAQ Endpoints', () => {
    it('should create an FAQ', async () => {
        const faqData = { question: 'What is Node.js?', answer: 'Node.js is a runtime.' };
        const res = await request(app).post('/api/faqs').set('Authorization', `Bearer ${token}`).send(faqData);
        expect(res.status).toBe(201);
        expect(res.body.data.question).toBe('What is Node.js?');
        faqId = res.body.data._id;
    });

    it('should fetch FAQs', async () => {
        const res = await request(app).get('/api/faqs');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should fetch FAQs in specified language', async () => {
        const faqData = { question: 'What is Node.js?', answer: 'Node.js is a runtime.' };
        await request(app).post('/api/faqs').set('Authorization', `Bearer ${token}`).send(faqData);

        const res = await request(app).get('/api/faqs?lang=hi'); // Fetch FAQs with language parameter
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        // You can add more specific checks based on your implementation
    });

    it('should update an FAQ', async () => {
        const res = await request(app).put(`/api/faqs/${faqId}`).set('Authorization', `Bearer ${token}`).send({ question: 'Updated?', answer: 'Yes' });
        expect(res.status).toBe(200);
        expect(res.body.data.question).toBe('Updated?');
    });

    it('should not create an FAQ without question and answer', async () => {
        const res = await request(app).post('/api/faqs').set('Authorization', `Bearer ${token}`).send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Question and answer are required');
    });
});
