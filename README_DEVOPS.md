# 🚀 UniIssueHub — DevOps & Deployment Guide

Welcome to the **UniIssueHub Operations** manual. We have engineered this system to be highly portable, scalable, and demo-ready with zero-manual configuration.

### 🛠️ The 3-Tier Containerized Architecture
Our system uses a microservices-inspired architecture designed for enterprise-grade deployment:

1.  **Frontend (Web Tier)**: A high-performance React SPA served via **Nginx (Alpine)**. It is decoupled from the backend and can be served from a CDN or specialized edge locations.
2.  **Backend (API Tier)**: An **Express.js** application containerized for horizontal scalability. It handles business logic, real-time WebSockets, and AI processing.
3.  **Database (Data Tier)**: A **MongoDB** instance for high-availability persistent storage, managed via Docker volumes for data durability.

---

### 📦 Quick Start — One Command Deployment
To launch the entire stack on your local machine or a cloud VPS:

```bash
# 1. Clone the repository
git clone https://github.com/atul-upadhyay-7/complaint-system.git
cd complaint-system

# 2. Fire up the orchestration engine
docker-compose up --build -d
```
The system will automatically:
- Spin up a MongoDB instance.
- Build and start the AI API Gateway (Port 5000).
- Build and serve the High-Resolution UI via Nginx (Port 80).
- **Auto-seed** the database with demo accounts for immediate judging.

---

### 📡 CI/CD Pipeline (GitHub Actions)
We have implemented a rigorous **Automated Quality Gate** using GitHub Actions:
- **Lint & Build Checks**: Every PR to `main` is automatically built on a GitHub runner to catch syntax errors.
- **Dependency Auditing**: Ensures that all 100+ dependencies are installable and conflict-free.
- **Docker Validation**: Automatically tests the `docker-compose.yml` integrity on every push.

---

### 📈 Scalability Roadmap
For a production campus deployment (10,000+ students), UniIssueHub is ready for:

| Phase | Strategy |
| :--- | :--- |
| **Phase 1: Local** | Current Docker Compose setup — best for departmental use. |
| **Phase 2: Hybrid** | Deploy Backend/DB to a private cloud VPC, serve Frontend via AWS S3 + CloudFront. |
| **Phase 3: Elite Scale** | Deploy to **Kubernetes (K8s)** with horizontal pod autoscaling (HPA) for the API tier during high-load periods (e.g., hostel intake weeks). |

---

### 🛡️ Security Posture
- **JWT Authentication**: Industry-standard stateless identity management.
- **Nginx Hardening**: Production-ready Nginx config for DDoS mitigation.
- **Container Isolation**: Backend and DB are isolated in a private Docker network, only accessible via the pre-configured API gateway.

---
**UniIssueHub — Engineering Excellence from Code to Cloud.** ☁️✨
