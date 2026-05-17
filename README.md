# 🎓 PLSP Engineering Insights Repository

A centralized academic resource hub built specifically for the **Pamantasan ng Lungsod ng San Pablo (PLSP) Engineering Department**. This platform enables instructors to securely publish academic resources while giving students streamlined access to high-quality PDF modules and video lecture materials.

## ✨ Features

### 👨‍🏫 Instructor Portal
- 🔐 Secure registration and login with email validation
- 🔍 Alphabetically organized resource catalog
- 📤 **Unified Resource Publisher** for uploading course materials with custom:
  - Titles
  - Categories
  - Descriptions
- 📄 **PDF Module Upload**
  - Supports study guides up to **25MB**
- 🎬 **Video Lecture Streaming**
  - Supports video uploads up to **500MB**
- 📊 **Dynamic Dashboard**
  - Real-time analytics and material upload tracking

### 🧑‍🎓 Student & Guest Interface
- 🔐 Secure registration and login with email validation
- 🔍 Alphabetically organized resource catalog
- 📑 **Role-Based Access Control (RBAC)**
  - Guests can browse the homepage
  - Downloads and streaming require a login
- 📱 **Mobile-First Responsive Design**
  - Optimized for:
    - Smartphones
    - Tablets
    - Laptops
    - Desktop devices
- 🎭 **Built-in Modal Video Player**
  - Watch lectures directly within the platform

## 🚀 Cloud Architecture & Tech Stack

### Frontend
- **HTML5 & CSS3**
  - Semantic structure with glassmorphism-inspired UI
- **Bootstrap 5.3**
  - Responsive layout framework
- **JavaScript (ES6+)**
  - Authentication persistence via `localStorage`
  - Client-side route protection
- **FontAwesome 6.5**
  - Scalable vector icons

### Backend & Cloud Infrastructure
- **Node.js & Express**
  - Server-side routing and API handling
- **PostgreSQL (`pg`)**
  - Relational database for user and metadata management
- **BcryptJS**
  - Password hashing and security
- **Vercel Blob Storage**
  - Distributed PDF asset storage
- **Cloudinary SDK**
  - Video processing and optimization
- **Multer**
  - Multipart form-data handling

## 🔧 Installation & Environment Setup

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js v18+**
- **npm v9+**
- A live **PostgreSQL** database instance
- Active accounts for:
  - **Cloudinary**
  - **Vercel**

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Running Environment
PORT=5000
NODE_ENV=development

# PostgreSQL Database
DATABASE_URL=your_postgresql_connection_string

# Cloudinary Credentials
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm start
```

The application will run at:

```bash
http://localhost:5000
```

## 📁 Repository Directory Architecture

```bash
plsp-engg-insights-repository/
├── 📂 api/
│   └── 📄 server.js         # Core Express App engine & dynamic router
├── 📂 css/
│   └── 📄 homepage.css      # Core styles & mobile media query blocks
├── 📂 js/
│   ├── 📄 analytics.js      # Aggregates real-time repository metric counts
│   ├── 📄 homepage.js       # Client authentication & resource modal constraints
│   ├── 📄 latestresources.js# Renders newly published course assets
│   └── 📄 mgmt.js           # Instructor publishing forms interaction handler
├── 📂 img/                  # Graphic asset directory
├── 📄 index.html            # Main Landing Portal layout file
├── 📄 about.html            # Department overview interface
├── 📄 portalaccess.html     # Secure signup/login registration page
├── 📄 repository.html       # Public asset catalog display board
├── 📄 vercel.json           # Master cloud url rewrites rule map
└── 📄 package.json          # Node dependency configurations record
```

## 🔐 Access Control

| Role | Permissions |
|------|------------|
| **Guest** | Browse homepage only |
| **Student** | Stream and download resources |
| **Instructor** | Upload, manage, and publish resources |

## 🌐 Deployment

This system is optimized for deployment on:

- **Vercel** (Frontend + Blob Storage)
- **Cloudinary** (Video Streaming)
- **PostgreSQL Cloud Hosting**
  - Neon
  - Supabase
  - Railway

Deploy using:

```bash
vercel deploy
```

## 🎯 Purpose

The **PLSP Engineering Insights Repository** was designed to:

- Improve digital academic resource accessibility
- Centralize engineering course materials
- Enhance remote and blended learning experiences
- Provide a scalable cloud-based academic repository for PLSP

## 📜 License

This project is intended for **academic and institutional use** by PLSP.

---

> Empowering engineering education through centralized digital learning resources.
