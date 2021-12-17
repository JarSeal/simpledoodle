import express from 'express';
import Event from './../models/event';

const listEventsRouter = express.Router();

listEventsRouter.get('/', async (request, response) => {
    // Todo: display only id and name
    const result = await Event.find({});
    response.json(result);
});

export default listEventsRouter;