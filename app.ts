import config from './utils/config';
import express from 'express';
import mongoose from 'mongoose';
import listEventsRouter from './controllers/list_events';
import addEventRouter from './controllers/add_event';
import showEventRouter from './controllers/show_event';
import middleware from './utils/middleware';
import logger from './utils/logger';

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    logger.info('connected to MongoDB');
}).catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
});

const app = express();

app.use(express.json());
app.use(middleware.requestLogger);

const baseUrl = '/api/v1/event';
app.use(baseUrl, listEventsRouter);
app.use(baseUrl, showEventRouter);
app.use(baseUrl, addEventRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;