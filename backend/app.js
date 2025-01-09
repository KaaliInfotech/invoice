const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config/.env' });
const connectDB = require('./config/db');
const route = require('./routes');
const {uploadLogo,uploadSignature, upload} = require('./config/multer');
const PORT = process.env.PORT || 3000
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/api/:filename", (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "public/logo", filename);
  
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).send("Image not found");
      }
    });
  });

  app.post("/api/upload-logo",upload, (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    const logoPath = path.join("public", "logo", req.file.filename);
  
    res.json({
      url: `http://localhost:5001/${logoPath}`,
    });
  });

connectDB();

app.use('/api', route);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});