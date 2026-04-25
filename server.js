const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { Pool } = require('pg');
const pool = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log('Created uploads directory');
}

app.use(cors());
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/signup/student', async (req, res) => {
    const { first_name, last_name, student_number, hashedPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO students (first_name, last_name, student_number, password) VALUES($1, $2, $3, $4) RETURNING*",
            [first_name, last_name, student_number, hashedPassword]
        );
        res.status(201).json({ message: "Student registered!" });
    } catch (err) {
        res.status(500).json({ error: "Student Number already registered." });
    }
});

app.post('/api/signup/instructor', async (req, res) => {
    const { first_name, last_name, email, hashedPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO instructors (first_name, last_name, email_address, password) VALUES($1, $2, $3, $4) RETURNING*",
            [first_name, last_name, email, hashedPassword]
        );
        res.status(201).json({ message: "Instructor registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Email already in use." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, student_number, hashedPassword, role } = req.body; 
    
    try {
        let user;
        if (role === 'instructor') {
            const result = await pool.query("SELECT * FROM instructors WHERE email_address = $1", [email]);
            user = result.rows[0];
        } else {
            const result = await pool.query("SELECT * FROM students WHERE student_number = $1", [student_number]);
            user = result.rows[0];
        }

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        if (password === user.password || await bcrypt.compare(password, user.password)) {
            res.json({
                message: "Login successful",
                user: {
                    user_id: user.user_id, 
                    first_name: user.first_name,
                    last_name: user.last_name
                }
            });
        } else {
            res.status(401).json({ error: "Invalid password" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

app.post('/api/resources', upload.single('file'), async (req, res) => {
    const { title, type, fileUrl, userId } = req.body;
    const file_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const result = await pool.query(
        "INSERT INTO resources (title, resource_type, file_url, uploaded_by_id) VALUES ($1, $2, $3, $4)",
        "SELECT r.*, i.first_name, i.last_name",
        "FROM resources r",
        "JOIN instructors i ON r.uploaded_by_id = i.user_id"
        [title, type, fileUrl, userId]
    );
        res.status(201).json(newResource.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to upload resource." });
    }
});

app.delete('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM resources WHERE resources_id = $1", [id]);
        res.json({ message: "Resource deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "Delete failed." });
    }
});

app.put('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    const { title, resource_type, description } = req.body;

    try {
        const updateResource = await pool.query(
            "UPDATE resources SET title = $1, resource_type = $2, description = $3 WHERE resources_id = $4 RETURNING *",
            [title, resource_type, description, id]
        );

        if (updateResource.rows.length === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }

        res.json({ message: "Resource updated successfully!", resource: updateResource.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during update" });
    }
});

app.get('/api/resources', async (req, res) => {
    try {
        const allResources = await pool.query(
            "SELECT * FROM resources ORDER BY created_at DESC"
        );
        res.json(allResources.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error fetching resources" });
    }
});

app.get('/api/resources/latest', async (req, res) => {
    try {
        const video = await pool.query("SELECT * FROM resources WHERE resource_type = 'video' ORDER BY created_at DESC LIMIT 1");
        const pdf = await pool.query("SELECT * FROM resources WHERE resource_type = 'pdf' ORDER BY created_at DESC LIMIT 1");
        res.json({
            latestVideo: video.rows[0],
            latestPdf: pdf.rows[0]
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running internally!`);
});