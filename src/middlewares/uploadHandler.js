// middleware xử lí lỗi của multer exception

import multer from 'multer';  
import logger from '../config/loggerConfig.js';

export const handleMulterError = (uploadMiddleware) => {
    return(req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
            // Nếu lỗi do vượt quá giới hạn số file
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                logger.warn('Vượt quá số lượng file cho phép.', {
                    ip: req.ip,
                    url: req.originalUrl,
                    method: req.method,
                    filesReceived: req.files?.length || 0,
                });
                return res.status(400).json({ error: 'Vượt quá số lượng file cho phép (tối đa 10).' });
            }

            // Các lỗi multer khác (như kích thước file quá lớn)
            logger.warn('Lỗi multer khác.', {
                error: err.message,
                code: err.code,
                ip: req.ip,
                url: req.originalUrl,
            });
            return res.status(400).json({ error: err.message });
        }

        // Nếu là lỗi không xác định
        if (err) {
            logger.error('Lỗi không xác định khi upload file.', {
            error: err.message,
            ip: req.ip,
            url: req.originalUrl,
            });
            return res.status(500).json({ error: 'Lỗi không xác định khi upload file.' });
        }

        // Nếu upload thành công
        logger.info(`Upload thành công ${req.files.length} file.`, {
            ip: req.ip,
            url: req.originalUrl,
            method: req.method,
            filenames: req.files.map(f => f.originalname),
        });
            next(); // chuyển middleware
        });
    };
}