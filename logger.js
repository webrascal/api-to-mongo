import winston, { format } from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, colorize, align, printf } = format;

const formatter = printf(info => {
    return `${info.timestamp} [${info.level}] ${info.message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
    format: combine(
        timestamp(),
        align(),
        formatter
    ),
    transports: [
        new (winston.transports.DailyRotateFile)({
            filename: '%DATE%.log',
            maxSize: '2m',
            maxFiles: '2',
            dirname: 'logs'
        }),
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                align(),
                formatter
            ),
        }),
    ]
});

export default logger;