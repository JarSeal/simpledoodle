import express from 'express';
import mongoose from 'mongoose';
import Event from './../models/event';
import { eventType } from '../interfaces/event.interface';
import { Request, Response } from 'express';

const showResultsRouter = express.Router();

showResultsRouter.get('/:id/results', async (request: Request, response: Response) => {
    const id = request.params ? request.params['id'] : null;
    
    if(mongoose.Types.ObjectId.isValid(id)) {
        const event = await Event.findById(id);
        if(event) {
            const people = getAllPeople(event);
            const results = getResults(people, event);
            return response.json(results);
        }
    }
    response.status(404).json({ errorMsg: 'Event not found.', errorCode: 'eventNotFound' });
});

const getAllPeople = (event: eventType) => {
    const votes = event.votes;
    const people:[string?] = [];
    for(let i=0; i<votes.length; i++) {
        const votesPeople = votes[i].people;
        for(let j=0; j<votesPeople.length; j++) {
            if(!people.includes(votesPeople[j])) {
                people.push(votesPeople[j]);
            }
        }
    }
    return people;
};

const getResults = (people: [string?], event: eventType) => {
    const votes = event.votes;
    const suitableDates = [];
    for(let i=0; i<votes.length; i++) {
        if(votes[i].people.length === people.length) {
            suitableDates.push(votes[i]);
        }
    }
    return {
        id: event.id,
        name: event.name,
        suitableDates
    };
};

export default showResultsRouter;