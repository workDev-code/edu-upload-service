import express from "express";
import {
  handleUpload,
  listUploadedFiles,
  deleteUpload,
  handleUploadMultileFiles,
} from "../controllers/uploadController.js";
import { handleMulterError } from "../middlewares/uploadHandler.js";
import { typeConfigs } from "../config/mimeTypesConfig.js";
import { createLogger } from "../config/loggerConfig.js";
import { createMulterUploaderForType } from "../config/multerConfig.js";
const logger = createLogger(import.meta.url || __filename);

const uploadRouter = express.Router();

// uploadRouter.post(
//   "/single-file",
//   handleMulterError(upload.single("file")),
//   handleUpload
// );

// catch exception
// uploadRouter.post(
//   "/multile-files",
//   handleMulterError(upload.array("files", 10)),
//   handleUploadMultileFiles
// );

uploadRouter.get("/", listUploadedFiles);

uploadRouter.delete("/delete", deleteUpload);

const types = ["images", "videos", "documents", "audios"];

types.forEach((type) => {
  if (!typeConfigs[type]) {
    throw new Error(`Không tìm thấy config cho type: ${type}`);
  }

  const maxFiles = typeConfigs[type].maxFiles;

  const upload = createMulterUploaderForType(type);

  uploadRouter.post(
    `/${type}`,
    handleMulterError(upload.array("files", maxFiles)),
    handleUploadMultileFiles(type)
  );
});

// mixes
// uploadRouter.post(
//   "/mixes",
//   handleMulterError(upload.array("files", 10)),
//   handleUploadMultileFiles("mixes")
// );

export default uploadRouter;
