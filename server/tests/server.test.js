const request = require('supertest');
const app = require('../src/app');

describe('API Health Check', () => {
    it('should return 200 and welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Welcome to Sweet Shop API');
    });
});
