# 🖼️ Interactive Gallery

> A full-stack image gallery built as part of the **Full-Stack Developer Interview Assessment** for **The Open Marketplace (TOM)**.  
This project demonstrates end-to-end skills in **React + TypeScript**, **Node.js + Express**, **PostgreSQL**, and **Unsplash API integration** — all wrapped in clean code and a delightful user experience.

---

## 🚀 Live Demo

🔗 **Frontend (Vercel)**: [https://aliu-adeniji-interactive-gallery.vercel.app](https://aliu-adeniji-interactive-gallery.vercel.app)  
🔗 **Backend (Render)**: [https://interactive-gallery-backend.onrender.com](https://interactive-gallery-backend.onrender.com)  

---

## 📁 Project Structure

```
interactive-gallery/
├── frontend/ # React + Vite + TypeScript (UI)
└── backend/ # Node.js + Express + TypeScript (API)
```


---

## ✨ Features

### 🖼️ Image Gallery
- Fetches images from the **Unsplash API**
- Displays **thumbnail**, **title**, and **author**
- Click to view full-size image and details

### 💬 Comments
- Leave comments on individual images
- Comments stored and retrieved from **PostgreSQL**
- Basic validation (e.g., minimum length)

### 🔐 User Authentication *(Bonus)*
- Register/Login via simple auth
- Auth state persisted locally

### ❤️ Likes *(Bonus)*
- Users can like images
- Like count persists across sessions

### 🔄 Pagination *(Bonus)*
- Paginated API calls
- Infinite scrolling implemented for smooth UX

---

## 🛠️ Tech Stack

| Frontend               | Backend                      | Database        | API             | Deployment       |
|------------------------|------------------------------|------------------|------------------|------------------|
| React + Vite + TS      | Node.js + Express + TS       | Neon PostgreSQL | Unsplash API    | Vercel / Render  |

---

## 🧠 Assessment Objective

This project was built as part of a **technical interview challenge** from **The Open Marketplace (TOM)**.  
The goal: showcase full-stack skills in:

- ✅ React + TypeScript (frontend)
- ✅ Express.js + PostgreSQL (backend)
- ✅ REST API development
- ✅ API integration (Unsplash)
- ✅ Code structure, clarity, and quality

📝 **Assessment Deadline**: July 7th, 2025  
📧 **Submission**: team@theopenmarket.art

---

## 🧪 How to Run Locally

### 🖥 Backend

```bash
cd backend
cp .env.example .env  # Add your database and secret values
npm install
npm run build
npm start
```
---

### 🌐 Frontend
```
cd frontend
cp .env.example .env  # Add VITE_API_URL for backend
npm install
npm run dev
```

### 🔐 Environment Variables
```
PORT=5000
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_jwt_secret
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## 📦 Backend (backend/.env)
```
PORT=5000
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_jwt_secret
```

## 🎨 Frontend (frontend/.env)
```
VITE_API_URL=https://interactive-gallery-backend.onrender.com
```
---

### ✅ Core Requirements Covered 
```
| Feature                         | Status               |
| ------------------------------- | -------------------- |
| React + TypeScript frontend     | ✅ Completed          |
| RESTful API with Express.js     | ✅ Completed          |
| PostgreSQL integration          | ✅ Completed          |
| Unsplash API integration        | ✅ Completed          |
| Comments system                 | ✅ Completed          |
| Bonus: User authentication      | ✅ Implemented        |
| Bonus: Image likes              | ✅ Implemented        |
| Bonus: Pagination               | ✅ Implemented        |
| Deployed frontend & backend     | ✅ Completed          |
| Code organization & readability | ✅ Clean & documented |

```
---
### 📂 Sample API Endpoints
```
| Method | Endpoint                    | Description             |
| ------ | --------------------------  | ----------------------- |
| GET    | `/api/images`               | Get gallery images      |
| GET    | `/api/images/:unsplashid`   | Get image details       |
| POST   | `/api/comments`             | Add comment to an image |
| POST   | `/api/auth/register`        | Register a new user     |
| POST   | `/api/auth/login`           | Login user              |
```

---
### 👨‍💻 Author
Adeniji Aliu Adeyemi
Full-Stack Software Engineer
📧 adenijialiuadeyemi@gmail.com • 🌐 https://www.github.com/adenijialiuadeyemi

---
### 📝 License
This project is open-source and available under the MIT License.

---
Thank you for reviewing my submission. Looking forward to the opportunity to discuss it further! 🙏
