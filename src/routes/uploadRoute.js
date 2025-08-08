import express from 'express';
import upload from "../config/multerConfig.js";
import {handleUpload, handleUploadMultileFiles, listUploadedFiles, deleteUpload} from '../controllers/uploadController.js';
import {handleMulterError} from "../middlewares/uploadHandler.js";

const uploadRouter = express.Router();

uploadRouter.post('/single-file', upload.single('file'), handleUpload);

// catch exception
uploadRouter.post('/multile-files',
  handleMulterError(upload.array('files', 10)),
  handleUploadMultileFiles
);

uploadRouter.get('/', listUploadedFiles);


uploadRouter.delete('/delete/:filename', deleteUpload)

export default uploadRouter;