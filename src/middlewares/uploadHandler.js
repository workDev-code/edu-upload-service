// middleware xử lí lỗi của multer exception
import multer from 'multer';  
import logger from '../config/loggerConfig.js';
import {
    logUnexpectedFileLimit,
    logMulterError,
    logUnknownUploadError,
    logUploadSuccess
} from "../config/loggerConfig.js"

export const handleMulterError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          logUnexpectedFileLimit(req);
          return res.status(400).json({ error: 'Vượt quá số lượng file cho phép (tối đa 10).' });
        }

        logMulterError(err, req);
        return res.status(400).json({ error: err.message });
      }

      if (err) {
        logUnknownUploadError(err, req);
        return res.status(500).json({ error: 'Lỗi không xác định khi upload file.' });
      }

      logUploadSuccess(req);
      next();
    });
  };
};
