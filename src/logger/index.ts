import * as winston from 'winston';
import * as path from 'path';

const transports: Array<any> = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`),
    ),
  }),
];

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      handleExceptions: true,
      format: winston.format.json(),
    }),
  )
}

// instantiate a new Winston Logger with the settings defined above
const logger: winston.Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.label({ label: path.basename(require.main.filename) }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Format the metadata object)
  ),
  transports,
  exitOnError: false,
})

// create a stream object with a 'write' function that will be used by `morgan`
export const myStream = {
  write: (message: string) => {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

// Override the base console log with winston
console.log = (...args: any) => logger.http.call(logger, ...args);
console.log = (...args: any) => logger.verbose.call(logger, ...args);
console.log = (...args: any) => logger.silly.call(logger, ...args);
console.log = (...args: any) => logger.info.call(logger, ...args);
console.warn = (...args: any) => logger.warn.call(logger, ...args);
console.error = (...args: any) => logger.error.call(logger, ...args);

export default logger;
