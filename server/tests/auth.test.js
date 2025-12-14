const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Connect to a test database before running tests
beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(MONGO_URI);
});

// Clear the database before and after each test
beforeEach(async () => {
    await User.deleteMany({});
});

afterEach(async () => {
    await User.deleteMany({});
});

// Close the connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should not register a user with an existing email', async () => {
            // Create a user first
            await new User({
                username: 'existing',
                email: 'test@example.com',
                password: 'password123'
            }).save();

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'newuser',
                    email: 'test@example.com', // Same email
                    password: 'password456'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a registered user and return a token', async () => {
            // Create a user first - Model handles hashing
            await new User({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123'
            }).save();

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
});
