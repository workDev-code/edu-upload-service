import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


// tạo đường dẫn tuyệt đối
const uploadPath = path.join(__dirname, 'uploads');
console.log('__dirname:', __dirname);


// tao option
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    // Đảm bảo thư mục upload tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath); // ✅ luôn đúng
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// tạo hàm 
const upload = multer({ storage });

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
