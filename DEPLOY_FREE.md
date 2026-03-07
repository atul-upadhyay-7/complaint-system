# 🌐 UniIssueHub — Free Deployment Playbook

To win the hackathon, your app needs to be accessible via a public URL. Follow these steps to deploy the entire stack **permanently and for $0**.

---

### Step 1: Database (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  Deploy a **FREE Shared Cluster** (M0). 
3.  In "Network Access", add `0.0.0.0/0` (allows access from Render/Vercel).
4.  In "Database Access", create a user with a password.
5.  Click **Connect** -> **Connect your application** and copy the `SRV` connection string.
    *   *Example: `mongodb+srv://user:pass@cluster.mongodb.net/uniissuehub?retryWrites=true&w=majority`*

---

### Step 2: Backend (Render.com)
1.  Sign up for a free account at [Render.com](https://render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Settings:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables**:
    *   `PORT`: `10000` (Render's default)
    *   `MONGO_URI`: (Your Atlas string from Step 1)
    *   `JWT_SECRET`: (Any long random string)
    *   `FRONTEND_URL`: (You will get this after Step 3)
6.  Once deployed, copy the Render URL (e.g., `https://complaint-backend.onrender.com`).

---

### Step 3: Frontend (Vercel)
1.  Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2.  Click **Add New** -> **Project**.
3.  Import your repository.
4.  Project Settings:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: `Vite`
5.  **Environment Variables**:
    *   `VITE_API_URL`: (Your Render URL + `/api`)
    *   *Example: `https://complaint-backend.onrender.com/api`*
6.  Click **Deploy**.

---

### Step 4: Final Glue
Go back to your **Render (Backend)** settings and update the `FRONTEND_URL` environment variable with your new Vercel URL (e.g., `https://uniissuehub.vercel.app`). This fixes CORS and Socket.io.

---

### 🌟 Pro Tips for Judges
- Mention that use **Vercel's Edge Network** for the frontend to ensure low-latency UI.
- Highlight that the backend is **stateless**, making it ready for horizontal scaling on Render's paid tiers if needed.
- Mention **MongoDB Atlas** providing 512MB of free storage, which handles ~10,000+ complaints easily.
