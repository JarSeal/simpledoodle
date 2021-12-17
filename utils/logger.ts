const info = (...params) => {
    if(process.env.NODE_ENV === 'test') return;
    // Just to display on the terminal
    console.log(...params);
};

const log = (...params) => {
    if(process.env.NODE_ENV === 'test') return;
    // Log something to logs
    // Implement here..
    console.log(...params);
};

const error = (...params) => {
    // Log something to logs
    // Implement here..
    console.error(...params);
};
  
const logger = {
    info, error, log
};

export default logger;