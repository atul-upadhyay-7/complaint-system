<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/graduation-cap.svg" width="80" height="80" alt="CampusDesk Logo">
  
  # 🎓 CampusDesk (UniIssuehub v2.1)
  **The Next-Generation Complaint Management & Resolution Platform**

  [![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](#)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css&logoColor=white)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white)](#)
  [![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socketdotio&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)](#)

  <p align="center">
    Built for the <strong>EliteCoder Hackathon</strong> 🚀
  </p>
</div>

---

## 🌟 The "Wow" Factor

CampusDesk isn't just another CRUD app. It's a fully real-time, aesthetically stunning, and highly modular platform designed to completely digitize and streamline university complaint pipelines. 

Here's what sets it apart to impress the judges:

- ⚡ **Real-Time WebSockets (Socket.io):** No manual refreshing. When an admin updates a complaint status, the student is instantly notified via toast popups and the Notification Bell, powered by secure, user-specific socket rooms.
- 💎 **Premium "Electric Blue" Glassmorphism UI:** A jaw-dropping dark mode interface built with custom Tailwind keyframes (`animate-float`, `shimmer`), blurred backdrops (`backdrop-filter: blur(20px)`), and dynamic hover lifts that make the app feel alive.
- 📊 **Live Analytics Dashboards:** Built-in **Recharts** visualizations (Donut & Bar charts) give administrators an instant birds-eye view of campus issues, resolution efficiency, and peak complaint times.
- 📍 **Interactive Progress Timeline:** Students can track their complaints step-by-step (Submitted -> Assigned -> In Progress -> Resolved) through an expandable, responsive timeline widget.
- 📸 **Robust Image Uploads:** Seamless drag-and-drop file zones with base64 conversion and 10MB payload scaling allow students to submit photographic evidence securely.

---

## 🎥 Full End-to-End Demo

![CampusDesk Full Demo](./demo.webp)
*(Above: Full walkthrough showing Login -> Admin Analytics -> Light/Dark Theme Toggle -> Student Timeline -> Image Upload)*

---

## 🛠️ Tech Stack Architecture

**Frontend (Client)**
- **Framework:** React 18 + Vite (Lightning fast HMR)
- **Styling/UI:** Tailwind CSS + Shadcn UI (Radix Primitives)
- **State/Routing:** React Router DOM, Context API (`AuthContext`, `ThemeContext`, `SocketContext`)
- **Data Vislualization:** Recharts
- **Icons & Polish:** Lucide React, React Hot Toast

**Backend (API Server)**
- **Runtime:** Node.js + Express.js
- **Real-Time Engine:** Socket.io (with Redis-ready isolated user rooms)
- **Database:** MongoDB + Mongoose ORM
- **Security:** JWT Authentication, Bcrypt Password Hashing, Helmet, Rate Limiting (express-rate-limit)

---

## 🚀 Getting Started (Run it Locally!)

It only takes 2 commands to spin up the entire application.

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# The backend API runs on http://localhost:5000
```
> **Note:** Ensure you have `.env` configured with `MONGO_URI` and `JWT_SECRET`.
> The database is heavily seeded with demo users and complaints automatically on startup!

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# The frontend UI runs on http://localhost:5173
```

### 🔑 Demo Accounts 
The easiest way to test is clicking the **"Demo Accounts"** buttons on the Login Page, or manually entering:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@campus.edu` | `admin123` |
| **Student** | `student@campus.edu` | `student123` |
| **Technician** | `tech@campus.edu` | `tech123` |
| **Warden** | `warden@campus.edu` | `warden123` |

---

## 🏗️ Core Features & Capabilities

1. **Role-Based Access Control (RBAC):** Secure routing and UI elements tailored to 4 completely different user profiles.
2. **Infinite Theme Toggling:** Flawless transition between Dark and Light mode via CSS variables, saving to `localStorage`.
3. **Skeleton Loading States:** High-performance perceived load times with custom `shimmer` bounding boxes before data fetching completes.
4. **Resilient Data Models:** Extensive Mongo Schemas linking Students, Authorities, Complaint Histories, and action logs.
5. **Drag-and-Drop Attachments:** Zero-friction UX for submitting issues with physical evidence.

---
<div align="center">
  <i>Built with ❤️ for a better campus experience.</i>
</div>
