# MERN Issue Tracker Application

## 📌 Overview

This project is a full-stack Issue Tracker application built as part of an assessment. It allows users to manage issues with full CRUD functionality, authentication, and efficient data handling.

## 🚀 Features

* User authentication (JWT-based login & registration)
* Create, read, update, and delete issues
* Issue status workflow: **Open → In Progress → Resolved**
* Search and filter issues (backend-driven)
* Debounced search input for optimized API calls
* Infinite scrolling with pagination
* User-specific issue visibility

## 🛠 Tech Stack

**Frontend**

* React (Vite)
* Redux Toolkit

**Backend**

* Express.js (Node.js)
* JWT Authentication
* bcrypt (password hashing)

**Database**

* MySQL (normalized schema)

---

## ⚙️ Setup Instructions

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` file in `/server`:

```
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

---

## 🌐 API Base URL

* Local: `http://localhost:PORT`
* Production: (to be added after deployment)

---

## 🧠 Assumptions

* Users can only access issues created by themselves
* Status transitions are strictly forward-only
* Search and filtering are handled on the backend
* JWT is stored in localStorage for simplicity

---

## 📦 Deliverables

* Full-stack application
* Clean architecture and modular structure
* Optimized API handling

---

## 🔗 Future Improvements

* Role-based access (admin)
* Refresh token authentication
* Full-text search optimization
* Deployment (Vercel + Render)
