const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'resources'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

if (!fs.existsSync('./resources')){
    fs.mkdirSync('./resources');
}

const GLOBAL_MAX = 500 * 1024 * 1024; 

const upload = multer({ 
    storage: storage,
    limits: { fileSize: GLOBAL_MAX } 
});

app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const path = require('path');

app.use(express.static(__dirname));

app.use(express.static(path.join(__dirname, 'contents')));

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/portalaccess.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contents', 'portalaccess.html'));
});

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

app.post('/api/login', async (req, res) => {
    const { student_number, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM students WHERE student_number = $1", [student_number]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Student Number not found." });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }

        res.json({ 
            message: "Login successful!", 
            user: {
                student_number: user.rows[0].student_number,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name
            } 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login." });
    }
});

app.post('/api/signup/instructor', async (req, res) => {
    const { first_name, last_name, email_address, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query(
            "INSERT INTO instructors (first_name, last_name, email_address, password) VALUES ($1, $2, $3, $4)",
            [first_name, last_name, email_address, hashedPassword]
        );

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

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Instructor email not found." });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }

        res.json({ 
            message: "Login successful!", 
            user: {
                email_address: user.rows[0].email_address,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name
            } 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login." });
    }
});

app.post('/api/resources', (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "File exceeds the 500MB maximum system limit." });
            }
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) return res.status(400).json({ error: "No file uploaded." });

        const PDF_LIMIT = 25 * 1024 * 1024;   
        const VIDEO_LIMIT = 500 * 1024 * 1024; 
        
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const fileSize = req.file.size;

        let isInvalid = false;
        let errorMessage = "";

        if (fileExt === '.pdf' && fileSize > PDF_LIMIT) {
            isInvalid = true;
            errorMessage = "PDF modules must be under 25MB.";
        } 
        else if (['.mp4', '.mkv', '.mov'].includes(fileExt) && fileSize > VIDEO_LIMIT) {
            isInvalid = true;
            errorMessage = "Video files must be under 500MB.";
        }

        if (isInvalid) {
            fs.unlinkSync(req.file.path); 
            return res.status(400).json({ error: errorMessage });
        }
        
    try {
        const { title, resource_type, description, uploaded_by_name } = req.body;
        const db_path = req.file ? `/resources/${req.file.filename}` : null;

        const query = `
            INSERT INTO resources (title, resource_type, description, file_url, uploaded_by_name) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING resources_id`;
        
        const values = [title, resource_type, description, db_path, uploaded_by_name];

        const result = await pool.query(query, values);
        
        res.status(201).json({ 
            message: "Success", 
            resource_id: result.rows[0].resource_id 
        });

    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});
});

app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/api/resources', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM resources ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/resources/:id', (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "Update failed: New file exceeds 100MB limit." });
            }
            return res.status(400).json({ error: err.message });
        }

    const { id } = req.params;
    const { title, description, resource_type, userName, removeFile } = req.body;
    
    try {
        const currentData = await pool.query('SELECT file_url FROM resources WHERE resources_id = $1', [id]);
        if (currentData.rows.length === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }
        const oldFileUrl = currentData.rows[0].file_url;

        let query = `
            UPDATE resources 
            SET title = $1, description = $2, resource_type = $3 
            WHERE resources_id = $4`;
        let params = [title, description, resource_type, id];
        let shouldDeleteOldFile = false;

        if (req.file) {
            const newFileUrl = `/resources/${req.file.filename}`;
            query = `UPDATE resources SET title = $1, description = $2, resource_type = $3, file_url = $5 WHERE resources_id = $4`;
            params.push(newFileUrl);
            shouldDeleteOldFile = true;
        } else if (removeFile === 'true') {
            query = `UPDATE resources SET title = $1, description = $2, resource_type = $3, file_url = NULL WHERE resources_id = $4`;
            shouldDeleteOldFile = true;
        }

        const result = await pool.query(query, params);

        if (shouldDeleteOldFile && oldFileUrl) {
            const filePathOnDisk = path.join(__dirname, oldFileUrl); 
            
            fs.unlink(filePathOnDisk, (err) => {
                if (err) console.error(`Failed to delete old file: ${filePathOnDisk}`, err);
                else console.log(`Successfully deleted old file: ${filePathOnDisk}`);
            });
        }

        res.json({ message: "Updated successfully and storage cleaned!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during update" });
    }
});
});

app.delete('/api/resources/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT file_url FROM resources WHERE resources_id = $1', [id]);
        
        if (result.rows.length > 0) {
            const fileUrl = result.rows[0].file_url;

            await pool.query('DELETE FROM resources WHERE resources_id = $1', [id]);

            if (fileUrl) {
                const filePath = path.join(__dirname, fileUrl);
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error deleting file during resource removal:", err);
                });
            }
            res.json({ message: "Resource and file deleted successfully" });
        } else {
            res.status(404).json({ error: "Resource not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
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

app.get('/api/resources', async (req, res) => {
    try {
        const sql = "SELECT resources_id, title, resource_type, description, file_url, uploaded_by_name, created_at FROM resources ORDER BY created_at DESC";
        const result = await pool.query(sql);
        
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});