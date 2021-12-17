import express from 'express';
import mongoose from 'mongoose';
import logger from './../utils/logger';
import Event from './../models/event';

const addVotesRouter = express.Router();

interface voteData {
    name: string,
    votes: [string],
}

addVotesRouter.post('/:id/vote', async (request, response) => {
    const id = request.params ? request.params['id'] : null;
    let eventNotFound = true, event;
    if(mongoose.Types.ObjectId.isValid(id)) {
        event = await Event.findById(id);
        if(event) eventNotFound = false;
    }
    if(eventNotFound) {
        return response.status(404).json({ errorMsg: 'Event not found.' });
    }

    const body = request.body;
    
    // Validate vote dates
    const dateValidationError = validateVoteDates(event, body);
    if(dateValidationError) {
        logger.log('Vote date fail.', dateValidationError);
        return response.json(dateValidationError);
    }

    // Migrate new data to old
    const newData = migrateVotesData(event, body);
    console.log(newData);

    response.json({msg:'lilsomething', newData: newData});

    // No errors, try updating the data
    // Event.findByIdAndUpdate(id, newData, (err, result) => {
    //     response.json(result);
    // });

    // No errors, try saving the data to DB
    // try {
    //     const event = new Event({
    //         name: body.name.trim(),
    //         dates: body.dates || [],
    //     });
    //     const savedEvent = await event.save();
    //     response.json({
    //         id: savedEvent.id
    //     });
    // } catch(e) {
    //     logger.error('Could not save event.', e);
    //     response.status(500).json({ errorMsg: 'Could not save event.' });
    // }
});

const validateVoteDates = (event: Event, newData: voteData) => {
    const newDates = newData.votes;
    for(let i=0; i<event.dates.length; i++) {
        if(!newDates.includes(event.dates[i])) {
            return {
                errorMsg: 'Voted date was not an option.',
                errorField: 'votes',
                errorCode: 'voteDateNotFound',
            };
        }
    }

    return null; // No errors found
};

const migrateVotesData = (event: Event, newData: voteData) => {
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