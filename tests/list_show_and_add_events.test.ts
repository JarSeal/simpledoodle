import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';
import Event from './../models/event';

const api = supertest(app);

beforeAll(async () => {
    jest.setTimeout(10000);
    await Event.deleteMany({});
});

describe('API tests for list, add, and show events', () => {
    let oneEventId;

    it('no events should be found', async () => {
        const response = await api.get('/api/v1/event/list');
        expect(response.body.length).toBe(0);
    });

    it('three events should be added', async () => {
        const event1 = await api.post('/api/v1/event').send({ name: 'My new event number 1' });
        const event2 = await api.post('/api/v1/event').send({ name: 'My new event number 2', dates: ['2021-01-05'] });
        const event3 = await api.post('/api/v1/event').send({ name: 'My new event number 3', dates: ['2021-01-05', '2021-01-06', '2021-01-09'] });
        expect(event1.body.id.length === 24).toBe(true);
        expect(event2.body.id.length === 24).toBe(true);
        expect(event3.body.id.length === 24).toBe(true);
        oneEventId = event3.body.id;
    });

    it('three events should be found', async () => {
        const response = await api.get('/api/v1/event/list');
        expect(response.body.length).toBe(3);
    });

    it('event addition should fail with no name given', async () => {
        const event1 = await api.post('/api/v1/event').send({ name: '' });
        const event2 = await api.post('/api/v1/event').send({});
        expect(event1.body.errorCode === 'nameIsRequired' && event2.body.errorCode === 'nameIsRequired').toBe(true);
    });

    it('event addition should fail with too short name given', async () => {
        const event1 = await api.post('/api/v1/event').send({ name: 'a' });
        expect(event1.body.errorCode === 'nameTooShort').toBe(true);
    });

    it('event addition should fail with too long name given', async () => {
        let longName = '';
        for(let i=0; i<2000; i++) { longName += 'a'; }
        const event1 = await api.post('/api/v1/event').send({ name: longName });
        expect(event1.body.errorCode === 'nameTooLong').toBe(true);
    });

    it('event addition should fail with invalid date formats and dates', async () => {
        const event1 = await api.post('/api/v1/event').send({ name:'Some name 1', dates: [''] });
        const event2 = await api.post('/api/v1/event').send({ name:'Some name 2', dates: ['fdsafdsafdsa'] });
        const event3 = await api.post('/api/v1/event').send({ name:'Some name 3', dates: ['2013-40-12'] });
        const event4 = await api.post('/api/v1/event').send({ name:'Some name 4', dates: ['2013-02-29'] }); // Was not a leap year
        expect(event1.body.errorCode === 'invalidDate').toBe(true);
        expect(event2.body.errorCode === 'invalidDate').toBe(true);
        expect(event3.body.errorCode === 'invalidDate').toBe(true);
        expect(event4.body.errorCode === 'invalidDate').toBe(true);
    });

    it('show event should show all event info', async () => {
        const event1 = await api.get('/api/v1/event/' + oneEventId);
        expect(event1.body.id === oneEventId).toBe(true);
        expect(event1.body.dates.length).toBe(3);
        expect(event1.body.name).toBe('My new event number 3');
        expect(event1.body.votes.length).toBe(0);
    });
});

afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
});