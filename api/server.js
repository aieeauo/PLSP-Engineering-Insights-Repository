require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const app = express();
const multer = require('multer');
const path = require('path');
const { put } = require('@vercel/blob'); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const GLOBAL_MAX = 500 * 1024 * 1024;

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: GLOBAL_MAX }  
});

app.use(cors({
  origin: [
      /\.vercel\.app$/, 
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://localhost:3000'
  ], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/api/signup/student', async (req, res) => {
    const { first_name, last_name, student_number, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO students (first_name, last_name, student_number, password) VALUES($1, $2, $3, $4)",
            [first_name, last_name, student_number, hashedPassword]
        );
        res.status(201).json({ message: "Student account created!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during registration." });
    }
});

app.post('/api/login/student', async (req, res) => {
    const { student_number, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM students WHERE student_number = $1", [student_number]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Student Number not found." });
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password." });
        res.json({ message: "Login successful!", user: { student_number: user.rows[0].student_number, first_name: user.rows[0].first_name, last_name: user.rows[0].last_name } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login." });
    }
});

app.post('/api/signup/instructor', async (req, res) => {
    const { first_name, last_name, email_address, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO instructors (first_name, last_name, email_address, password) VALUES ($1, $2, $3, $4)", [first_name, last_name, email_address, hashedPassword]);
        res.status(201).json({ message: "Instructor account created!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during registration" });
    }
});

app.post('/api/login/instructor', async (req, res) => {
    const { email_address, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM instructors WHERE email_address = $1", [email_address]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Instructor email not found." });
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password." });
        res.json({ message: "Login successful!", user: { email_address: user.rows[0].email_address, first_name: user.rows[0].first_name, last_name: user.rows[0].last_name } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login." });
    }
});

app.post('/api/resources', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: "File exceeds the 500MB maximum system limit." });
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const PDF_LIMIT = 25 * 1024 * 1024;   
    const VIDEO_LIMIT = 500 * 1024 * 1024; 
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const fileSize = req.file.size;

    try {
      const { title, resource_type, description, uploaded_by_name } = req.body;
      let final_url = "";

      if (fileExt === '.pdf') {
        if (fileSize > PDF_LIMIT) return res.status(400).json({ error: "PDF modules must be under 25MB." });
        
        const blob = await put(`resources/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        final_url = blob.url;
      } 
      else if (['.mp4', '.mkv', '.mov'].includes(fileExt)) {
        if (fileSize > VIDEO_LIMIT) return res.status(400).json({ error: "Video files must be under 500MB." });
        
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "engineering_repo", resource_type: "video" },
            (error, result) => { if (error) reject(error); else resolve(result); }
          );
          stream.end(req.file.buffer);
        });
        final_url = result.secure_url;
      }

      const query = `INSERT INTO resources (title, resource_type, description, file_url, uploaded_by_name) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING resources_id`;
      
      const result = await pool.query(query, [title, resource_type, description, final_url, uploaded_by_name]);

      res.status(201).json({ message: "Success", resource_id: result.rows[0].resources_id });
    } catch (err) {
      console.error("UPLOAD ERROR:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
});

app.get('/api/resources', async (req, res) => {
    try {
        const sql = `SELECT * FROM resources ORDER BY title ASC`;
        const result = await pool.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: "Failed to load resources alphabetically." });
    }
});

app.get('/api/resources/latest', async (req, res) => {
    const query = `
        (SELECT * FROM resources WHERE resource_type = 'pdf' ORDER BY created_at DESC LIMIT 1)
        UNION ALL
        (SELECT * FROM resources WHERE resource_type = 'video' ORDER BY created_at DESC LIMIT 1)
    `;
    try {
        const result = await pool.query(query);
        const response = {
            latestPdf: result.rows.find(r => r.resource_type === 'pdf') || null,
            latestVideo: result.rows.find(r => r.resource_type === 'video') || null
        };
        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/resources/:id', upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { title, description, resource_type, removeFile } = req.body;

    try {
        const currentData = await pool.query('SELECT file_url FROM resources WHERE resources_id = $1', [id]);
        if (currentData.rows.length === 0) return res.status(404).json({ error: "Resource not found" });

        let final_url = currentData.rows[0].file_url;

        if (req.file) {
            const fileExt = path.extname(req.file.originalname).toLowerCase();
            if (fileExt === '.pdf') {
                const blob = await put(`resources/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
                    access: 'public',
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });
                final_url = blob.url;
            } else {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "engineering_repo", resource_type: "video" },
                        (error, res) => { if (error) reject(error); else resolve(res); }
                    );
                    stream.end(req.file.buffer);
                });
                final_url = result.secure_url;
            }
        } else if (removeFile === 'true') {
            final_url = null;
        }

        const query = `UPDATE resources SET title = $1, description = $2, resource_type = $3, file_url = $4 WHERE resources_id = $5`;
        await pool.query(query, [title, description, resource_type, final_url, id]);

        res.json({ message: "Updated successfully via Cloud Storage!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during update" });
    }
});

app.delete('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM resources WHERE resources_id = $1', [id]);
        res.json({ message: "Resource deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const rootDir = process.cwd(); 

app.use('/css', express.static(path.join(rootDir, 'css')));
app.use('/js', express.static(path.join(rootDir, 'js')));
app.use('/img', express.static(path.join(rootDir, 'img')));

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    
    if (page.startsWith('api')) return; 

    if (page.includes('.') && !page.endsWith('.html')) {
        return res.status(404).send('Not found');
    }

    const fileName = page.endsWith('.html') ? page : `${page}.html`;
    
    res.sendFile(path.join(rootDir, fileName), (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}

module.exports = app;