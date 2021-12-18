import express from 'express';
import mongoose from 'mongoose';
import logger from './../utils/logger';
import config from '../utils/config';
import Event from './../models/event';
import { eventType, voteDataType } from '../interfaces/event.interface';

const addVotesRouter = express.Router();

addVotesRouter.post('/:id/vote', async (request, response) => {
    const id = request.params ? request.params['id'] : null;
    let eventNotFound = true, event;
    if(mongoose.Types.ObjectId.isValid(id)) {
        event = await Event.findById(id);
        if(event) eventNotFound = false;
    }
    if(eventNotFound) {
        return response.status(404).json({ errorMsg: 'Event not found.', errorCode: 'eventNotFound' });
    }

    const body = request.body;

    // Validate participant name
    const participantNameError = validateParticipantName(body.name);
    if(participantNameError) {
        logger.log('Participant name fail.', participantNameError);
        return response.json(participantNameError);
    }
    
    // Validate vote dates
    const dateValidationError = validateVoteDates(event, body);
    if(dateValidationError) {
        logger.log('Vote date fail.', dateValidationError);
        return response.json(dateValidationError);
    }

    // Migrate new data to old
    const newData = migrateVotesData(event, body);

    // No errors, try updating the data
    try {
        await Event.findByIdAndUpdate(id, newData);
        response.json(newData);
    } catch(e) {
        logger.error('Could not add votes.', e);
        response.status(500).json({ errorMsg: 'Could not add votes.' });
    }
});

const validateParticipantName = (name) => {
    const nameRequirements = config.EVENT_VALIDATION.participantName;
    if(!name || name.length < nameRequirements.minlength) {
        return {
            errorMsg: `Participant name is missing or too short (minlength ${nameRequirements.minlength} chars).`,
            errorField: 'name',
            errorCode: 'participantNameMissingOrTooShort',
        };
    }
    if(name.length > nameRequirements.maxlength) {
        return {
            errorMsg: `Participant name is too long (maxlength ${nameRequirements.maxlength} chars).`,
            errorField: 'name',
            errorCode: 'participantNameTooLong',
        };
    }

    return null; // No errors
};

const validateVoteDates = (event: eventType, newData: voteDataType) => {
    const newDates = newData.votes;
    if(!newDates || !newDates.length) {
        return {
            errorMsg: 'At least one vote date is required.',
            errorField: 'votes',
            errorCode: 'votesIsRequired',
        };
    }
    for(let i=0; i<newDates.length; i++) {
        if(!event.dates.includes(newDates[i])) {
            return {
                errorMsg: 'Voted date was not an option.',
                errorField: 'votes',
                errorCode: 'voteDateNotFound',
            };
        }
    }

    return null; // No errors found
};

const migrateVotesData = (event: eventType, newData: voteDataType) => {
    if(!newData.votes) return event;

    for(let i=0; i<newData.votes.length; i++) {
        const date = newData.votes[i];
        let dateFound = false;
        for(let j=0; j<event.votes.length; j++) {
            if(event.votes[j].date === date) {
                dateFound = true;
                if(!event.votes[j].people.includes(newData.name)) {
                    event.votes[j].people.push(newData.name);
                }
            }
        }
        if(!dateFound) {
            event.votes.push({
                date,
                people: [ newData.name ],
            });
        }
    }

    return event;
};

export default addVotesRouter;