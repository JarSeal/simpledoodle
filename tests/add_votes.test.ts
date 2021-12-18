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

describe('API tests for adding votes', () => {
    it('one event should be found', async () => {
        const response = await api.get('/api/v1/event/list');
        expect(response.body.length).toBe(1);
    });

    it('should fail with errorCode participantNameMissingOrTooShort', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: '', votes: [] });
        expect(event1.body.errorCode === 'participantNameMissingOrTooShort').toBe(true);
    });

    it('should fail with errorCode participantNameTooLong', async () => {
        let longName = '';
        for(let i=0; i<2000; i++) { longName += 'a'; }
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: longName, votes: [] });
        expect(event1.body.errorCode === 'participantNameTooLong').toBe(true);
    });

    it('should fail with errorCode votesIsRequired', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jack' });
        expect(event1.body.errorCode === 'votesIsRequired').toBe(true);
    });

    it('should fail with errorCode voteDateNotFound', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jack', votes: ['1985-10-10'] });
        expect(event1.body.errorCode === 'voteDateNotFound').toBe(true);
    });

    it('should fail with errorCode eventNotFound', async () => {
        const event1 = await api.post('/api/v1/event/fsjkdfkjds/vote').send({ name: 'Jack', votes: ['2020-10-10'] });
        expect(event1.body.errorCode === 'eventNotFound').toBe(true);
    });

    it('should add a vote to the date 2020-10-10 with the name Jack', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jack', votes: ['2020-10-10'] });
        expect(event1.body.votes[0].people[0] === 'Jack' && event1.body.votes[0].date === '2020-10-10').toBe(true);
    });

    it('should add a vote to the dates 2000-11-11 and 1999-12-12 with the name Jeff', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jeff', votes: ['2000-11-11', '1999-12-12'] });
        expect(
            event1.body.votes[1].people[0] === 'Jeff' && event1.body.votes[1].date === '2000-11-11' &&
            event1.body.votes[2].people[0] === 'Jeff' && event1.body.votes[2].date === '1999-12-12'
        ).toBe(true);
    });

    it('should add a vote to the date 2000-11-11 with the name Jack', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jack', votes: ['2020-10-10'] });
        expect(event1.body.votes[0].people[0] === 'Jack' && event1.body.votes[0].date === '2020-10-10').toBe(true);
    });

    it('should add a vote to the date 2020-10-10 with the name Jack', async () => {
        const event1 = await api.post('/api/v1/event/'+oneEventId+'/vote').send({ name: 'Jack', votes: ['2020-10-10'] });
        expect(event1.body.votes[0].people[0] === 'Jack' && event1.body.votes[0].people.length === 1 && event1.body.votes[0].date === '2020-10-10').toBe(true);
    });
});

afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
});