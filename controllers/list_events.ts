import express from 'express';
import Event from './../models/event';

const listEventsRouter = express.Router();

listEventsRouter.get('/', async (request, response) => {
    // Todo: display only id and name
    const result = await Event.find({});
    const idAndName = result.map(item => { return { id: item.id, name: item.name }; });
    response.json(idAndName);
});

export default listEventsRouter;