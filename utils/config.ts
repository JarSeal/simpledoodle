import dotenv from 'dotenv';
dotenv.config();

const EVENT_VALIDATION = {
    name: {
        minlength: 3,
        maxlength: 6,
    },
    date: {
        regex: /^\d{4}-\d{2}-\d{2}$/,
    },
};

const PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

if(process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI;
}

const config = {
    MONGODB_URI,
    PORT,
    EVENT_VALIDATION,
};

export default config;