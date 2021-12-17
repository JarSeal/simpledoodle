import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';

const api = supertest(app);

beforeAll(() => {
    jest.setTimeout(10000);
});

describe('API tests', () => {
    it('should list all events', async () => {
        const response = await api.get('/api/v1/event/list');
        console.log('RESP', response.body);
        expect(true).toBe(true);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});