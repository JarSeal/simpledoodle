import mongoose from 'mongoose';
import config from './../utils/config';
import { eventType } from '../interfaces/event.interface';

const eventSchema = new mongoose.Schema<eventType>({
    name: {
        type: String,
        required: true,
        minlength: config.EVENT_VALIDATION.name.minlength,
        maxlength: config.EVENT_VALIDATION.name.maxlength,
    },
    dates: [
        {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 10,
        },
    ],
    votes: [
        {
            _id: false,
            date: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 10,
            },
            people: [
                {
                    type: String,
                    minlength: config.EVENT_VALIDATION.participantName.minlength,
                    maxlength: config.EVENT_VALIDATION.participantName.maxlength,
                },
            ],
        },
    ],
});

eventSchema
    .set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString();
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    });

const Event = mongoose.model('Event', eventSchema);
export default Event;