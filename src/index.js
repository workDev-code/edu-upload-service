import express from 'express';
import cors from 'cors';
import app from "./app.js"

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
