import mongoose from 'mongoose';

interface Event {
    name: string,
    dates: [string],
    votes: [string],
}

const eventSchema = new mongoose.Schema<Event>({
    name: {
        type: String,
        required: true,
        minlength: 3,
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
            date: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 10,
            },
            people: [
                {
                    type: String,
                    minlength: 2,
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