import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';
import Event from '../models/event';

const api = supertest(app);
let oneEventId;

beforeAll(async () => {
    jest.setTimeout(10000);
    await Event.deleteMany({});
    
    const event = new Event({
        name: 'My test event',
        dates: ['1999-12-12', '2000-11-11', '2020-10-10'],
    });
    const savedEvent = await event.save();
    oneEventId = savedEvent.id;
});

describe('API tests for showing results', () => {
    it('one event should be found', async () => {
        const response = await api.get('/api/v1/event/list');
        expect(response.body.length).toBe(1);
    });

    it('should fail with errorCode eventNotFound', async () => {
        const event1 = await api.get('/api/v1/event/fsjkdfkjds/results');
        expect(event1.body.errorCode === 'eventNotFound').toBe(true);
    });

    it('should return a empty array', async () => {
        const event1 = await api.get('/api/v1/event/'+oneEventId+'/results');
        expect(event1.body.suitableDates.length === 0).toBe(true);
    });

    it('should return one date with one participant', async () => {
        await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jack', votes: ['2020-10-10'] });
        const event1 = await api.get('/api/v1/event/'+oneEventId+'/results');
        expect(event1.body.suitableDates.length === 1 && event1.body.suitableDates[0].people.length === 1).toBe(true);
    });

    it('should return one date with two participant', async () => {
        await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jeff', votes: ['1999-12-12', '2020-10-10'] });
        const event1 = await api.get('/api/v1/event/'+oneEventId+'/results');
        expect(
            event1.body.suitableDates.length === 1 &&
            event1.body.suitableDates[0].people.length === 2 &&
            event1.body.suitableDates[0].date === '2020-10-10'
        ).toBe(true);
    });
});

afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
});