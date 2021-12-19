import express from 'express';
import Event from './../models/event';
import { Request, Response } from 'express';

const listEventsRouter = express.Router();

listEventsRouter.get('/list', async (request: Request, response: Response) => {
    const result = await Event.find({});
    const idAndName = result.map(item => { return { id: item.id, name: item['name'] }; });
    response.json(idAndName);
});

export default listEventsRouter;