import express from 'express';
import mongoose from 'mongoose';
import Event from './../models/event';
import { Request, Response } from 'express';

const showEventRouter = express.Router();

showEventRouter.get('/:id', async (request: Request, response: Response) => {
    const id = request.params ? request.params['id'] : null;
    
    if(mongoose.Types.ObjectId.isValid(id)) {
        const result = await Event.findById(id);
        if(result) {
            return response.json(result);
        }
    }
    response.status(404).json({ errorMsg: 'Event not found.' });
});

export default showEventRouter;