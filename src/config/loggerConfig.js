// logger.js
import winston from 'winston';
import moment from 'moment-timezone';

const logger = winston.createLogger({

    // level: 'info': tức là ghi log từ info trở lên (info, warn, error)
    // Những log nhỏ hơn (debug) sẽ bị bỏ qua nếu không khai báo
    level: 'info',

    format: winston.format.combine(
        winston.format.printf(({ level, message, ...meta }) => {
        const timestamp = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
        const metaInfo = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaInfo}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // In ra console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Ghi log lỗi ra file
        new winston.transports.File({ filename: 'logs/combined.log' }) // Ghi toàn bộ log ra file
    ],
});

export default logger;

export const logUnexpectedFileLimit = (req) => {
  logger.warn('Vượt quá số lượng file cho phép.', {
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    filesReceived: req.files?.length || 0,
  });
};

export const logMulterError = (err, req) => {
  logger.warn('Lỗi multer khác.', {
    error: err.message,
    code: err.code,
    ip: req.ip,
    url: req.originalUrl,
  });
};

export const logUnknownUploadError = (err, req) => {
  logger.error('Lỗi không xác định khi upload file.', {
    error: err.message,
    ip: req.ip,
    url: req.originalUrl,
  });
};


export const logUploadSuccess = (req) => {
  logger.info(`Upload thành công ${req.files.length} file.`, {
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    filenames: req.files.map(f => f.originalname),
  });
};



