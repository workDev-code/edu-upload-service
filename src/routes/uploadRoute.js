import express from 'express';
import {handleUpload} from '../controllers/uploadController.js'
import upload from "../config/multerConfig.js"

const uploadRouter = express.Router();

uploadRouter.post('/single-file', upload.single('file') ,handleUpload);

export default uploadRouter;