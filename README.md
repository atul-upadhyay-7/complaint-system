<div align="center">

# 🎓 UniIssueHub

### AI-Powered Campus Complaint Management & Resolution Platform

[![Built for](https://img.shields.io/badge/Built_for-EliteCoder_Hackathon_2026-blueviolet?style=for-the-badge&logo=hackthebox&logoColor=white)](#)

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white)](#)
[![NLP](https://img.shields.io/badge/NLP_Engine-natural-FF6F61?style=flat-square)](#)

<br/>

> **UniIssueHub** completely digitizes the campus complaint pipeline — from student submission to technician resolution — powered by a **custom-built NLP/AI engine** that auto-categorizes, auto-prioritizes, detects duplicates, and analyzes sentiment in **real-time**, all without any paid API.

<br/>

| 🧠 8 AI Pillars | ⚡ Real-Time WebSockets | 🎨 Premium Dark/Light UI | 🔐 4-Role RBAC |
|:---:|:---:|:---:|:---:|
| Naive Bayes + TF-IDF + Keyword Scoring | Socket.io per-user rooms | Glassmorphism + animations | Student · Admin · Warden · Technician |

</div>

---

## 🎯 The Purpose & Vision

### The Problem: "The Administrative Black Hole"
In most modern campuses, student complaints are a point of friction. Students submit issues via fragmented channels (WhatsApp, paper, or basic forms) and then wait in **silence**. Without transparency, students feel unheard, and without automation, administrators are overwhelmed by manual categorization, duplicate reports, and a lack of situational awareness.

### The Solution: UniIssueHub
**UniIssueHub** was engineered to Bridge the gap between campus administration and students. Our purpose is to turn **raw frustration into structured data and swift action**. By leveraging a **Local AI Ecosystem**, we've built a system that doesn't just "track" issues—it **understands** them.

| Feature | Yesterday (Legacy Manual) | Today (UniIssueHub AI) |
|---|---|---|
| **Categorization** | Manual sorting by busy admins | **Instant AI Auto-Tagging** (Bayes) |
| **Prioritization** | First-come, first-served (or squeakiest wheel) | **Urgency-First weighted AI scoring** |
| **Transparency** | Black hole — "We'll look into it" | **Live Resolution Timeline + ETAs** |
| **Efficiency** | Redundant work on duplicate reports | **TF-IDF Duplicate Audit System** |
| **Insights** | Anecdotal "vibe" of the campus | **Deep Aggregate Sentiment Heatmaps** |

---

## 🏆 Why This Project Stands Out

| 🤖 **Custom AI Engine** | Built a full NLP pipeline using `natural` — Naive Bayes classifier + TF-IDF similarity + weighted keyword scoring. **Zero paid APIs.** | Proves real ML understanding, not just API wrapping |
| 🚀 **Futuristic UX** | World-class Landing Page + **Command Palette (Ctrl+K)** + Framer Motion page transitions. | Creates a premium, app-like experience for judges |
| 🧠 **8 AI Features** | Auto-categorization, Priority, Sentiment, ETA, Duplicates, Live UI, Admin Analytics, Technical Protocols | End-to-end intelligent automation |
| 📡 **True Real-Time** | Socket.io with user-specific rooms + toast notifications + live bell counter | No polling, instant push updates |
| 💎 **Production-Grade UI** | Glassmorphism, animated particles, gradient headings, color-coded cards, dual themes | Not a prototype — a shippable product |
| 🧩 **Clean Architecture** | MVC pattern, service layer, middleware chain, async error handling, audit trail | Industry-standard code organization |
| 📬 **Async Email Pipeline** | Fire-and-forget Nodemailer — never blocks HTTP response | Real-world reliability pattern |
| 🛡️ **Enterprise Security** | JWT + bcrypt + Helmet + rate limiting + role middleware on every route | Production security posture |
| 🐳 **Docker-Ready** | Full orchestration stack — build and run the entire 3-tier system with one command. | Built for modern cloud deployment |
| 🛠️ **CI/CD Pipeline** | Automated GitHub Actions for syntax validation, build integrity, and audit. | Professional engineering standards |

---

## 🛠️ DevOps & Infrastructure

This project is engineered for **High Availability** and **Cloud Portability**. We don't just ship code; we ship a complete, reproducible infrastructure.

- **[Docker Deployment Guide](./README_DEVOPS.md)**: ⚡ One-command orchestration for Local, VPS, or Cloud.
- **Microservices Orchestration**: Scalable 3-tier container stack (Nginx + Express + MongoDB).
- **Automated CI/CD**: Rigorous quality gates powered by GitHub Actions.

---

## 🤖 AI Engine — Deep Dive

> Our AI runs **100% locally** using the [`natural`](https://github.com/NaturalNode/natural) NLP library. Zero cost. Zero latency. Works offline.

### Architecture

```
Student types complaint
        │
        ▼
┌───────────────────────────────────────────────────┐
│            /api/complaints/ai-suggest             │
│                  (live endpoint)                   │
├───────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────┐   ┌───────────────────────┐     │
│  │ Pass 1:      │   │ Pass 2:               │     │
│  │ Keyword Scan │──▶│ Naive Bayes Fallback  │     │
│  │ (100+ terms) │   │ (200+ training docs)  │     │
│  └──────┬───────┘   └───────────┬───────────┘     │
│         │                       │                 │
│         ▼                       ▼                 │
│  ┌──────────────────────────────────────────────┐ │
│  │        Category Detected → Auto-Route        │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌──────────────┐   ┌───────────────────────┐     │
│  │ 60+ Weighted │   │  Sentiment & Urgency  │     │
│  │ AI Scoring   │──▶│  Frustration Scoring  │     │
│  └──────┬───────┘   └───────────┬───────────┘     │
│         │                       │                 │
│         ▼                       ▼                 │
│  ┌──────────────────────────────────────────────┐ │
│  │   Priority & Mood: Critical / Frustrated     │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌──────────────┐   ┌───────────────────────┐     │
│  │  Resolution  │   │  TF-IDF Cosine        │     │
│  │  ETA Engine  │   │  Similarity vs DB     │     │
│  └──────┬───────┘   └───────────┬───────────┘     │
│         │                       │                 │
│         ▼                       ▼                 │
│  ┌──────────────┐   ┌───────────────────────┐     │
│  │ AI Protocol: │   │  Duplicate Warning    │     │
│  │  Technical   │   │  is flagged in DB     │     │
│  │  Directions  │   └───────────────────────┘     │
│  └──────────────┘                                 │
└───────────────────────────────────────────────────┘
        │
        ▼
        ┌──────────────────────────────────┐
        │        THE RECIPIENTS            │
        ├──────────────────────────────────┤
        │ 🎓 Student: Live ETA & Warning   │
        │ 🛡️ Admin: Mood Analytics         │
        │ 🏠 Warden: Urgency Badges        │
        │ 🔧 Technician: Repair Protocol   │
        └──────────────────────────────────┘
```

### The 8 AI Pillars

| # | Pillar | Technique | Impact |
|---|---|---|---|
| 1 | **Auto-Categorization** | Two-pass: Keyword scan (150+ terms) → Naive Bayes fallback | Decides routing without admin manual effort |
| 2 | **Auto-Prioritization** | Weighted keyword scoring (80+ terms) + urgency amplifiers | Ensures safety-critical issues bypass the queue |
| 3 | **Sentiment Analysis** | Frustration word classification + intensity scoring | Admin can see the collective "mood" of the campus |
| 4 | **Resolution ETA** | Category × Priority matrix (32 unique timeframes) | Manages student expectations, reducing stress |
| 5 | **Duplicate Detection** | TF-IDF vectorization + Cosine similarity (vs 50 recent) | Prevents database bloat and redundant work |
| 6 | **Live AI Suggestions** | Debounced (800ms) real-time API feedback | Acts as an intelligent companion during submission |
| 7 | **Technical Protocols** | Knowledge-based technical diagnosis mappings | Provides instant repair advice to junior staff |
| 8 | **Admin Mood Analytics** | Real-time aggregation of sentiment across issues | Predictive insight into campus satisfaction |

---

## ⚡ Key Features

### 👥 4-Role RBAC System
| Role | Capabilities |
|---|---|
| **🎓 Student** | Submit complaints with image upload, track live progress timeline, receive real-time notifications |
| **🛡️ Admin** | Full analytics dashboard (Recharts), manage all complaints, view campus-wide trends |
| **🏠 Warden** | View hostel complaints, assign technicians from dropdown, update status |
| **🔧 Technician** | View assigned work only, mark In Progress / Resolved, add admin notes |

### 📡 Real-Time Engine
- **Socket.io** with per-user rooms (`user:{id}`)
- Instant toast notifications on complaint status change
- Bell icon with live unread count badge
- Mark-all-read functionality

### 🎨 Premium UI/UX
- **Futuristic Landing Page**: High-conversion entry point with 3D-style animations and feature highlights
- **Command Palette (Ctrl+K)**: Direct-access navigation and AI command tool for power users
- **Page Transitions**: Fluid `framer-motion` transitions across every route for a seamless experience
- **Glassmorphism** design system with CSS custom properties
- **Dark ↔ Light** theme toggle (persisted to localStorage)
- Animated floating particles on login page
- Color-coded feature cards, gradient headings, micro-animations
- **EliteCoder Hackathon** badge with purple glow
- Responsive: mobile, tablet, and desktop layouts

### 📧 Async Email Notifications
- **Fire-and-forget** pattern via Nodemailer
- Never blocks HTTP response (non-blocking with `.catch()`)
- Emails sent on: complaint created, status changed, technician assigned

### 🔐 Security Stack
- JWT access tokens with role payload
- Bcrypt password hashing (10 salt rounds)
- Helmet.js security headers
- Express Rate Limiter (brute-force protection)
- Role-based middleware guards on every route

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React 18 + Vite 5 | Component UI + lightning-fast HMR |
| Tailwind CSS + Shadcn UI | Design system + Radix primitives |
| Socket.io Client | Real-time bi-directional events |
| React Router DOM v6 | Client-side RBAC routing |
| Recharts | Analytics charts + data visualization |
| Lucide React | Modern icon system |
| React Hot Toast | Non-blocking toast notifications |
| Context API | Auth, Socket, Theme state management |

### Backend
| Technology | Role |
|---|---|
| Node.js 22 + Express.js | RESTful API server |
| MongoDB + Mongoose | Document store + schema validation |
| Socket.io | Real-time room-based broadcasting |
| `natural` (NLP library) | Naive Bayes + TF-IDF + tokenization |
| JWT + Bcrypt | Authentication + password hashing |
| Nodemailer | Async email notifications |
| Winston | Structured logging (file + console) |
| Helmet + Express Rate Limiter | Security headers + brute-force protection |

---

## 📁 Project Structure

```
complaint-system/
│
├── backend/                          # Express.js API Server
│   ├── config/
│   │   └── db.js                     # MongoDB connection with Mongoose
│   ├── controllers/
│   │   ├── adminController.js        # Admin analytics & user management
│   │   ├── authController.js         # Register, login, password reset
│   │   └── complaintController.js    # CRUD + AI suggest endpoint
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification + role authorization
│   │   ├── errorHandler.js           # Global async error handler
│   │   ├── rateLimiter.js            # Brute-force protection
│   │   └── validate.js               # Express-validator middleware
│   ├── models/
│   │   ├── Complaint.js              # Schema: title, category, priority, AI fields
│   │   ├── ComplaintHistory.js       # Audit trail: every status change logged
│   │   └── User.js                   # Schema: name, email, role, hashed password
│   ├── routes/
│   │   ├── admin.js                  # GET /stats, GET /users
│   │   ├── auth.js                   # POST /register, /login, /forgot-password
│   │   └── complaints.js             # CRUD + POST /ai-suggest
│   ├── services/
│   │   ├── aiService.js              # 🧠 NLP Engine: Bayes + TF-IDF + scoring
│   │   ├── complaintService.js       # Business logic: create, update, email
│   │   └── notificationService.js    # Socket.io event emitter
│   ├── utils/
│   │   ├── asyncHandler.js           # Async/await error wrapper
│   │   ├── logger.js                 # Winston: file + console logging
│   │   └── sendEmail.js              # Nodemailer transporter
│   ├── seed.js                       # Auto-seed demo users + sample data
│   ├── server.js                     # Entry point: Express + Socket.io init
│   └── .env.example                  # Environment variable template
│
├── frontend/                         # React + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance + JWT interceptor
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── CategoryPieChart.jsx  # Recharts pie chart
│   │   │   │   └── WeeklyBarChart.jsx    # Recharts bar chart
│   │   │   ├── ui/                   # Shadcn UI base components
│   │   │   │   ├── avatar.jsx
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── progress.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   ├── separator.jsx
│   │   │   │   └── textarea.jsx
│   │   │   ├── AnimatedPage.jsx      # Framer Motion wrapper for transitions
│   │   │   ├── CommandBar.jsx        # Ctrl+K Command Palette component
│   │   │   ├── ComplaintCard.jsx      # Card with AI badges row
│   │   │   ├── ComplaintTimeline.jsx  # Progress step visualization
│   │   │   ├── DashboardStats.jsx     # Stats overview component
│   │   │   ├── NotificationBell.jsx   # Real-time bell + unread count
│   │   │   ├── ProtectedRoute.jsx     # RBAC route guard
│   │   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   │   └── SkeletonCard.jsx       # Loading skeleton
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # JWT auth state + login/logout
│   │   │   ├── SocketContext.jsx      # Socket.io connection manager
│   │   │   └── ThemeContext.jsx       # Dark/light theme toggle
│   │   ├── pages/
│   │   │   ├── AdminComplaints.jsx    # Admin: manage all complaints
│   │   │   ├── AdminDashboard.jsx     # Admin: analytics + charts
│   │   │   ├── Dashboard.jsx          # Student: overview
│   │   │   ├── ForgotPassword.jsx     # Password reset request
│   │   │   ├── LandingPage.jsx        # 🚀 Elite Futuristic Entry Page
│   │   │   ├── Login.jsx              # 💎 Premium login with particles
│   │   │   ├── MyComplaints.jsx       # Student: complaint list + timeline
│   │   │   ├── Notifications.jsx      # Notification center
│   │   │   ├── Register.jsx           # Student registration
│   │   │   ├── ResetPassword.jsx      # Password reset form
│   │   │   ├── SubmitComplaint.jsx    # 🧠 AI-powered form + live panel
│   │   │   ├── TechnicianDashboard.jsx# Technician: assigned complaints
│   │   │   └── WardenDashboard.jsx    # Warden: hostel management
│   │   ├── lib/
│   │   │   └── utils.js              # Shadcn utility functions
│   │   ├── App.jsx                    # Router + RBAC wrapper
│   │   ├── main.jsx                   # React DOM entry point
│   │   └── index.css                  # Global styles + animations
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** running locally or MongoDB Atlas URI

### 1. Clone & Install

```bash
git clone https://github.com/atul-upadhyay-7/complaint-system.git
cd complaint-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/complaint-system
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

# Email (Optional — Gmail App Password)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

```bash
npm run dev
# ✅ API running at http://localhost:5000
# ✅ AI Engine: Naive Bayes classifier trained
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# ✅ UI running at http://localhost:5173
```

> **Note:** The database auto-seeds demo users and 6 sample complaints on first startup.

---

## 🔑 Demo Accounts

Click the role buttons on the login page for one-click fill:

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | `admin@campus.edu` | `admin123` |
| 🎓 Student | `student@campus.edu` | `student123` |
| 🔧 Technician | `tech@campus.edu` | `tech123` |
| 🏠 Warden | `warden@campus.edu` | `warden123` |

---

## 🧪 Testing the AI

### Quick Test Cases

| Test | Title to Type | Expected AI Result |
|---|---|---|
| Category: Internet | `WiFi not working in hostel` | 🌐 Internet, 🟡 Medium, ⏱️ 1-3 days |
| Category: Water | `No water supply since morning` | 💧 Water, 🟢 Low, ⏱️ 2-4 days |
| High Priority | `URGENT: No electricity since 2 days!` | ⚡ Electricity, 🔴 High, ⏱️ 4-8 hours |
| Critical + Sentiment | `Terrible food, disgusting and pathetic!` | 🍽️ Food, 🚨 Critical, 🔥 Urgent, ⏱️ 1 hour |
| Duplicate Detection | Submit same complaint twice | ⚠️ "Similar complaint found! (71% match)" |

---

## 📊 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Create complaint (AI auto-processes) |
| POST | `/api/complaints/ai-suggest` | Live AI analysis (real-time panel) |
| GET | `/api/complaints` | List complaints (filtered by role) |
| GET | `/api/complaints/:id` | Get single complaint |
| PATCH | `/api/complaints/:id` | Update status/assignment |
| DELETE | `/api/complaints/:id` | Delete complaint |
| GET | `/api/complaints/:id/history` | Audit trail |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard analytics |
| GET | `/api/admin/users` | User management |

---

## 🏆 Submission Links

| Category | Link |
|---|---|
| **GitHub Repository** | [https://github.com/atul-upadhyay-7/EliteCoderHackathon](https://github.com/atul-upadhyay-7/EliteCoderHackathon) |
| **Interactive Prototype** | [🚀 Landing Page (Live)](https://atul-upadhyay-7.github.io/EliteCoderHackathon/prototype/landing.html) |
| **Student Hub View** | [🎓 Student Submission Hub](https://atul-upadhyay-7.github.io/EliteCoderHackathon/prototype/student.html) |
| **Admin Dashboard View** | [🛡️ Admin Command Center](https://atul-upadhyay-7.github.io/EliteCoderHackathon/prototype/admin.html) |
| **Technician View** | [🔧 Technician Repair Guide](https://atul-upadhyay-7.github.io/EliteCoderHackathon/prototype/tech.html) |

> [!TIP]
> **To make the prototype links work**: Go to your GitHub Repo Settings → **Pages** → Build and deployment → Branch: **main** → **Save**. This will host your prototype live!

---

## ️ Future Roadmap

- [ ] AI auto-assignment of technicians based on workload + specialty
- [ ] Image analysis — detect complaint category from uploaded photo
- [ ] Student satisfaction rating after resolution
- [ ] Complaint escalation rules (auto-escalate after 48h)
- [ ] Analytics export (PDF/CSV reports)
- [ ] Mobile PWA with push notifications

---

## 📺 Demo Video

[![UniIssueHub Demo Video](https://img.shields.io/badge/Watch_Demo_Video-Play-red?style=for-the-badge&logo=youtube&logoColor=white)](YOUR_VIDEO_LINK_HERE)

> **Note:** Replace the link above with your actual YouTube or Drive video link.

---

<div align="center">

### Built with ❤️ for a smarter campus

**EliteCoder Hackathon 2026**

Made by **Atul Upadhyay** & **Anshika**

</div>
