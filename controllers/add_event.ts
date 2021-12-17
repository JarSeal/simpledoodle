import express from 'express';
import logger from '../utils/logger';
import Event from './../models/event';

const addEventRouter = express.Router();

addEventRouter.post('/', async (request, response) => {
    const body = request.body;

    // Validate the name and dates
    if(!body.name || !body.name.trim().length) {
        response.json({ errorMsg: 'An event has to have the name attribute.', errorField: 'name', errorCode: 'nameIsRequired' });
        return;
    } else if(body.name.trim().length < 3) {
        response.json({ errorMsg: `Name has to be at least ${'3'} characters.`, errorField: 'name', errorCode: 'nameTooShort' });
        return;
    }
    
    try {
        const event = new Event({
            name: body.name,
            dates: body.dates || [],
        });
        const savedEvent = await event.save();
        response.json({
            id: savedEvent.id
        });
    } catch(e) {
        logger.error('Could not save event.', e);
        response.status(500).json({ errorMsg: 'Could not save event.' });
    }
});

export default addEventRouter;