# 🐳 UniIssueHub — DevOps & Deployment Guide

This document outlines the infrastructure, containerization, and deployment strategies for **UniIssueHub**.

---

## 🏗️ Architecture Overview

UniIssueHub follows a modern **3-Tier Architecture**:

1.  **Frontend**: React (Vite) Single Page Application.
2.  **Backend**: Node.js/Express API with Socket.io for real-time events.
3.  **Database**: MongoDB (Local for Dev / Atlas for Prod).

---

## 📦 Docker Orchestration

The project includes a `docker-compose.yml` for unified management.

### Prerequisites
- Docker Desktop installed
- .env files configured in `./backend` and `./frontend`

### Spin up the entire stack
```bash
docker-compose up --build
```

### Services included:
- **`backend`**: Exposed on port `5000`
- **`frontend`**: Exposed on port `5173`
- **`mongodb`**: Internally connected (no port exposed to host for security)

---

## 🚀 Production Deployment

### 1. Render.com (Backend)
- **Repo**: `atul-upadhyay-7/EliteCoderHackathon`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Envs**: Copy everything from your local `.env`.

### 2. Vercel (Frontend)
- **Repo**: `atul-upadhyay-7/EliteCoderHackathon`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Envs**: `VITE_API_URL` (Pointing to your Render URL).

---

## 🛡️ CI/CD Pipeline

We use **GitHub Actions** located in `.github/workflows/ci.yml`.

### Automated Checks:
- **Syntax Validation**: Ensures no broken JS/JSX.
- **Build Integrity**: Verifies the frontend builds without errors.
- **Audit**: Checks dependencies for known vulnerabilities.

### Trigger:
- Every **Push** to `main`.
- Every **Pull Request**.

---

## 📈 Monitoring & Logging

- **Winston**: All logs are captured in `backend/logs/app.log`.
- **Custom Metrics**: AI categorization accuracy and response times are logged for periodic review.

---

<div align="center">
  <b>Built for scalability and performance.</b>
</div>
