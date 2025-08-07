import express from 'express';
import upload from "../config/multerConfig.js";
import {handleUpload, handleUploadMultileFiles} from '../controllers/uploadController.js';
import {handleMulterError} from "../middlewares/uploadHandler.js";

const uploadRouter = express.Router();

uploadRouter.post('/single-file', upload.single('file'), handleUpload);

// catch exception
uploadRouter.post('/multile-files',
  handleMulterError(upload.array('files', 10)),
  handleUploadMultileFiles
);

export default uploadRouter;