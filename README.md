# 🎓 PLSP Engineering Insights Repository

A full-stack web application designed for the **PLSP Engineering Department** to centralize, manage, and share academic resources. This platform allows instructors to upload high-quality video lectures and PDF modules, overcoming traditional cloud hosting limitations.

## 🚀 Key Features
* **Dual-Storage Architecture:** Optimized handling of different media types.
    * **PDFs:** Managed via **Vercel Blob** for high-speed document delivery.
    * **Videos:** **Direct-to-Cloudinary** client-side uploading to bypass Vercel’s 4.5MB payload limits.
* **Instructor Dashboard:** Secure portal for faculty to upload, edit, and delete their specific resources.
* **Dynamic Resource Library:** A clean, searchable interface for students to access engineering materials.
* **Role-Based Permissions:** Ensures only the original uploader has administrative rights over a specific resource.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (ES6+), FontAwesome Icons
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (hosted via **Neon.tech**)
* **Storage Providers:** Cloudinary (Video) & Vercel Blob (Documents)
* **Deployment:** Vercel

## 🏗️ System Architecture
The project utilizes a hybrid **"Client-Side Upload"** strategy to ensure scalability:
1.  **PDF Path:** Browser → Server (Express) → Vercel Blob.
2.  **Video Path:** Browser → Cloudinary (Direct) → Server (Metadata Link only) → Neon DB.

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/aieeauo/PLSP-Engineering-Insights-Repository.git](https://github.com/aieeauo/PLSP-Engineering-Insights-Repository.git)

2. **Install dependencies:**
   ```bash
   npm install

3. **Environment Variables:** Create a .env file in the root directory and add your credentials:
   ```Code snippet
   DATABASE_URL=your_neon_db_url
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   CLOUDINARY_URL=your_cloudinary_url

4. **Run locally:**
   ```bash
   node api/server.js

## 👤 Project Team
**Anniejel Llaguno | Lead Developer & Technical Lead**
* Handled the end-to-end implementation of the platform, including the development of the server-side logic, database management, and the frontend interface. Engineered the hybrid storage architecture to bypass cloud payload limitations.

**Kheidyl Cleiah Calusa | UI/UX Consultant**
* Assisted in the visual layout and color scheme selection to ensure the repository remains user-friendly for engineering students.

**Euri Camua | Technical Content Associate**
* Coordinated the collection and organization of lecture materials and hardware modules for the repository database.

**Kimberly Cristobal | Project Documentation Specialist**
* Maintained the project records and helped draft the technical descriptions for the repository's academic hub.

**Lee Dechavez | Compliance & Security Assistant**
* Helped document the user access requirements and verified that login protocols meet the project's elective standards.

**Daniela Francine Marie Pujanes | Quality Assurance Support**
* Conducted cross-browser testing and provided feedback on the repository's functionality to identify potential bugs.
