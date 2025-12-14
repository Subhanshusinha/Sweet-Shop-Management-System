const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

let adminToken;
let userToken;

beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(MONGO_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create Admin
    const admin = await new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
    }).save();

    // Create User
    const user = await new User({
        username: 'user',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
    }).save();

    // Login to get tokens
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'password123' });
    userToken = userRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Sweets Endpoints', () => {
    describe('POST /api/sweets', () => {
        it('should create a sweet if admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Bar',
                    category: 'Chocolates',
                    price: 2.5,
                    quantity: 100
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('name', 'Chocolate Bar');
        });

        it('should not create a sweet if not admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Gummy Bears',
                    price: 1.0,
                    quantity: 50
                });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/sweets', () => {
        it('should get all sweets', async () => {
            await new Sweet({ name: 'Sweet 1', category: 'Cat 1', price: 1, quantity: 10 }).save();
            await new Sweet({ name: 'Sweet 2', category: 'Cat 2', price: 2, quantity: 20 }).save();

            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(2);
        });
    });

    describe('GET /api/sweets/search', () => {
        it('should search sweets by name', async () => {
            await new Sweet({ name: 'Chocolate Bar', category: 'Choc', price: 2, quantity: 10 }).save();
            await new Sweet({ name: 'Gummy Bears', category: 'Gummy', price: 1, quantity: 20 }).save();

            const res = await request(app)
                .get('/api/sweets/search?name=Chocolate')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Chocolate Bar');
        });

        it('should search sweets by category', async () => {
            await new Sweet({ name: 'Chocolate Bar', category: 'Choc', price: 2, quantity: 10 }).save();
            await new Sweet({ name: 'Gummy Bears', category: 'Gummy', price: 1, quantity: 20 }).save();

            const res = await request(app)
                .get('/api/sweets/search?category=Gummy')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Gummy Bears');
        });
    });

    describe('Inventory & Management', () => {
        let sweetId;

        beforeEach(async () => {
            const sweet = await new Sweet({
                name: 'Test Sweet',
                category: 'Test',
                price: 5,
                quantity: 10
            }).save();
            sweetId = sweet._id;
        });

        it('should update a sweet (Admin)', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 10 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.price).toEqual(10);
        });

        it('should delete a sweet (Admin)', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);

            const check = await Sweet.findById(sweetId);
            expect(check).toBeNull();
        });

        it('should purchase a sweet (User)', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 2 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toEqual(8);
        });

        it('should prevent purchase if insufficient stock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 20 });

            expect(res.statusCode).toEqual(400);
        });

        it('should restock a sweet (Admin)', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 5 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toEqual(15);
        });
    });
});
