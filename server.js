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

app.use(cors());
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

app.post('/api/resources', upload.single('file'), async (req, res) => {
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

app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/api/resources', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM resources ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    const { title, resource_type, description, userName } = req.body;

    try {
        const result = await pool.query(
            "UPDATE resources SET title = $1, resource_type = $2, description = $3 WHERE resources_id = $4 AND uploaded_by_name = $5",
            [title, resource_type, description, id, userName]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ error: "Update failed." });
        }
        res.json({ message: "Update successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    const { userName } = req.body; 

    try {
        const result = await pool.query(
            "DELETE FROM resources WHERE resources_id = $1 AND uploaded_by_name = $2",
            [id, userName]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ error: "Unauthorized or record not found." });
        }

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});