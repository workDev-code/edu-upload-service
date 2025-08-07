import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/uploadRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Đường dẫn tuyệt đối đến thư mục uploads
const uploadsDir = path.resolve(__dirname, './uploads');
console.log("📂 Static uploads folder mapped to:", uploadsDir);

app.use('/', express.static(path.join(__dirname, './public')));


app.use('/uploads', express.static(uploadsDir));

app.get('/', (_, res) => {
  res.json({ message: "Chào bạn! Đây là JSON response từ Express." });
});

app.use('/upload', uploadRouter);

export default app;
