import app from './app';
import http from 'http';
import config from './utils/config';
import logger from './utils/logger';

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Simple Doodle is running on port ${config.PORT}`);
});