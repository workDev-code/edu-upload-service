// logger.js
import winston from 'winston';

const logger = winston.createLogger({

    // level: 'info': tức là ghi log từ info trở lên (info, warn, error)
    // Những log nhỏ hơn (debug) sẽ bị bỏ qua nếu không khai báo
    level: 'info',

    format: winston.format.combine(
        // Thêm thời gian vào log
        winston.format.timestamp(), 
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // In ra console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Ghi log lỗi ra file
        new winston.transports.File({ filename: 'logs/combined.log' }) // Ghi toàn bộ log ra file
    ],
});

export default logger;




