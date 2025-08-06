import express from 'express';
import {handleUpload, handleUploadMultileFiles} from '../controllers/uploadController.js'
import upload from "../config/multerConfig.js"
import multer from 'multer';  

const uploadRouter = express.Router();

uploadRouter.post('/single-file', upload.single('file'), handleUpload);

const uploadMultipleFilesMiddleware = upload.array('files', 10);
// catch exception
uploadRouter.post('/multile-files',
    (req, res, next) => {
        uploadMultipleFilesMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
             if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: 'Vượt quá số lượng file cho phép (tối đa 10).' });
            }
            // lỗi do multer (vd: vượt số lượng file)
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // lỗi khác
            return res.status(500).json({ error: 'Lỗi không xác định khi upload file.' });
        }
            next();
        })
    }, // multer xử lí trước
    handleUploadMultileFiles  // chỉ chạy khi không có lỗi
);

export default uploadRouter;