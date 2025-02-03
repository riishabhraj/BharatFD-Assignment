import request from 'supertest';
import app from '../index'; // Ensure you import the correct Express app
import Admin from '../models/Admin';


import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { closeRedisConnection } from '../config/redis';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
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


describe('Admin Authentication', () => {
    const adminData = { username: 'admin', password: 'password123', email: 'admin@example.com' };

    it('should register a new admin', async () => {
        const res = await request(app).post('/api/admin/register').send(adminData);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Registration successful');
    });

    it('should not register with existing username', async () => {
        await request(app).post('/api/admin/register').send(adminData);
        const res = await request(app).post('/api/admin/register').send(adminData);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username already exists');
    });

    it('should log in an admin with correct credentials', async () => {
        await new Admin(adminData).save();
        const res = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
    });

    it('should not log in with wrong credentials', async () => {
        const res = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'wrongpass' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });
});
