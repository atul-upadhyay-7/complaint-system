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

| 🧠 6 AI Features | ⚡ Real-Time WebSockets | 🎨 Premium Dark/Light UI | 🔐 4-Role RBAC |
|:---:|:---:|:---:|:---:|
| Naive Bayes + TF-IDF + Keyword Scoring | Socket.io per-user rooms | Glassmorphism + animations | Student · Admin · Warden · Technician |

</div>

---

## 🏆 Why This Project Stands Out

| Differentiator | What We Built | Why It Matters |
|---|---|---|
| 🤖 **Custom AI Engine** | Built a full NLP pipeline using `natural` — Naive Bayes classifier + TF-IDF similarity + weighted keyword scoring. **Zero paid APIs.** | Proves real ML understanding, not just API wrapping |
| 🧠 **6 AI Features** | Auto-categorization, auto-prioritization, sentiment analysis, resolution ETA, duplicate detection, live AI panel | End-to-end intelligent automation |
| 📡 **True Real-Time** | Socket.io with user-specific rooms + toast notifications + live bell counter | No polling, instant push updates |
| 💎 **Production-Grade UI** | Glassmorphism, animated particles, gradient headings, color-coded cards, dual themes | Not a prototype — a shippable product |
| 🧩 **Clean Architecture** | MVC pattern, service layer, middleware chain, async error handling, audit trail | Industry-standard code organization |
| 📬 **Async Email Pipeline** | Fire-and-forget Nodemailer — never blocks HTTP response | Real-world reliability pattern |
| 🛡️ **Enterprise Security** | JWT + bcrypt + Helmet + rate limiting + role middleware on every route | Production security posture |

---

## 🤖 AI Engine — Deep Dive

> Our AI runs **100% locally** using the [`natural`](https://github.com/NaturalNode/natural) NLP library. Zero cost. Zero latency. Works offline.

### Architecture

```
Student types complaint
        │
        ▼
┌─────────────────────────────────────────────────┐
│            /api/complaints/ai-suggest            │
│                  (live endpoint)                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐   ┌───────────────────────┐   │
│  │ Pass 1:      │   │ Pass 2:               │   │
│  │ Keyword Scan │──▶│ Naive Bayes Fallback  │   │
│  │ (100+ terms) │   │ (200+ training docs)  │   │
│  └──────┬───────┘   └───────────┬───────────┘   │
│         │                       │                │
│         ▼                       ▼                │
│  ┌─────────────────────────────────────────┐    │
│  │        Category Detected                │    │
│  │   (Electricity/Water/Internet/Food/...) │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────┐   ┌───────────────────────┐   │
│  │ 60+ Weighted │   │  Urgency Amplifiers   │   │
│  │ Keywords     │──▶│  ALL-CAPS + !! boost  │   │
│  └──────┬───────┘   └───────────┬───────────┘   │
│         │                       │                │
│         ▼                       ▼                │
│  ┌─────────────────────────────────────────┐    │
│  │   Priority: Critical / High / Med / Low │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────┐   ┌───────────────────────┐   │
│  │ Negative &   │   │  TF-IDF Cosine        │   │
│  │ Positive     │   │  Similarity vs 50     │   │
│  │ Word Scoring │   │  existing complaints  │   │
│  └──────┬───────┘   └───────────┬───────────┘   │
│         │                       │                │
│         ▼                       ▼                │
│  ┌──────────────┐   ┌───────────────────────┐   │
│  │  Sentiment:  │   │  Duplicate Warning    │   │
│  │  🔥Urgent    │   │  if >70% match found  │   │
│  │  😤Frustrated│   └───────────────────────┘   │
│  │  😐Neutral   │                               │
│  │  😊Polite    │   ┌───────────────────────┐   │
│  └──────────────┘   │  ETA: Category ×      │   │
│                     │  Priority matrix       │   │
│                     │  (e.g. "4-8 hours")    │   │
│                     └───────────────────────┘   │
└─────────────────────────────────────────────────┘
        │
        ▼
  Live AI Panel updates in real-time on frontend
```

### The 6 AI Features

| # | Feature | Technique | Input → Output |
|---|---|---|---|
| 1 | **Auto-Categorization** | Two-pass: Keyword scan (100+ terms) → Naive Bayes fallback (200+ training docs) | `"WiFi down in hostel"` → `Internet` |
| 2 | **Auto-Prioritization** | Weighted keyword scoring (60+ terms) + urgency amplifiers (CAPS, `!!`) | `"URGENT no water since 3 days!!"` → `Critical` |
| 3 | **Sentiment Analysis** | Negative/Positive word classification with frustration amplifiers | `"Disgusting food, pathetic!"` → `🔥 Urgent` |
| 4 | **Resolution ETA** | Category × Priority matrix (8 categories × 4 levels = 32 ETAs) | `Electricity + High` → `4-8 hours` |
| 5 | **Duplicate Detection** | TF-IDF vectorization + Cosine similarity against 50 recent complaints | `"Water issue Block A"` → `⚠️ 71% match found` |
| 6 | **Live AI Panel** | Debounced (800ms) real-time API calls as user types | Updates category, priority, sentiment, ETA live |

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

## ️ Future Roadmap

- [ ] AI auto-assignment of technicians based on workload + specialty
- [ ] Image analysis — detect complaint category from uploaded photo
- [ ] Student satisfaction rating after resolution
- [ ] Complaint escalation rules (auto-escalate after 48h)
- [ ] Analytics export (PDF/CSV reports)
- [ ] Mobile PWA with push notifications

---

<div align="center">

### Built with ❤️ for a smarter campus

**EliteCoder Hackathon 2026**

Made by [**Atul Upadhyay**](https://github.com/atul-upadhyay-7)

</div>
