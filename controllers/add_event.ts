import express from 'express';
import config from './../utils/config';
import logger from './../utils/logger';
import Event from './../models/event';
import { Request, Response } from 'express';

const addEventRouter = express.Router();

addEventRouter.post('/', async (request: Request, response: Response) => {
    const body = request.body;

    // Validate the name and dates
    const nameValidationError = validateName(body.name);
    if(nameValidationError) {
        logger.log('Name validation backend error.', nameValidationError); // Validation errors should be caught in frontend, so this error should be logged
        return response.json(nameValidationError);
    }
    const datesValidationError = validateDates(body.dates);
    if(datesValidationError) {
        logger.log('Data format validation backend error.', datesValidationError); // Validation errors should be caught in frontend, so this error should be logged
        return response.json(datesValidationError);
    }
    
    // No errors, try saving the data to DB
    try {
        const event = new Event({
            name: body.name.trim(),
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

const validateName = (name: string) => {
    const nameConfig = config.EVENT_VALIDATION.name;

    if(!name || !name.trim().length) {
        return {
            errorMsg: 'An event has to have the name attribute.',
            errorField: 'name',
            errorCode: 'nameIsRequired',
        };
    } else if(name.trim().length < nameConfig.minlength) {
        return {
            errorMsg: `Name has to be at least ${nameConfig.minlength} characters.`,
            errorField: 'name',
            errorCode: 'nameTooShort'
        };
    } else if(name.trim().length > nameConfig.maxlength) {
        return {
            errorMsg: `Name cannot be more than ${nameConfig.maxlength} characters.`,
            errorField: 'name',
            errorCode: 'nameTooLong'
        };
    }

    return null; // No errors
};

const validateDates = (dates: [string]) => {
    if(!dates) return null;

    for(let i=0; i<dates.length; i++) {
        if(!isValidDate(dates[i])) {
            return {
                errorMsg: 'Date is not in a valid format.',
                errorField: 'dates',
                errorCode: 'invalidDate',
            };
        }
    }

    return null; // No errors
};

const isValidDate = (dateString: string) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
};

export default addEventRouter;