const winston = require('winston');
const path = require('path');

// Clean log format: timestamp [level]: message
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // 1. Always print to terminal console with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // 2. Save errors to logs/error.log
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'logs', 'error.log'),
      level: 'error'
    }),
    // 3. Save all logs to logs/combined.log
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'logs', 'combined.log')
    })
  ]
});

module.exports = logger;
