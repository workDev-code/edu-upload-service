import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import upload from "./config/multerConfig.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());





// Tạo route GET "/"
app.get('/', (req, res) => {
  res.json({ message: "Chào bạn! Đây là JSON response từ Express." });
});


app.post('/upload', upload.single('file'), (req, res) => {
  try{
   

      if (!req.file) {
        return res.status(400).json({ error: 'Không có file nào được gửi lên.' });
      }

      console.log('File nhận được:', req.file);
      res.status(200).json({
        message: 'Tải lên thành công!',
        file: req.file
      });
  }
  catch{
      console.error('Lỗi trong quá trình upload:', error);
      res.status(500).json({
        error: 'Đã xảy ra lỗi trong quá trình upload. Vui lòng thử lại sau.'
      });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
