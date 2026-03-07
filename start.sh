#!/bin/bash
# 🚀 UniIssueHub — Rock-Solid Demo Launcher
# Use this when Docker/Podman is unavailable on the local machine.

echo "🔥 Launching UniIssueHub — Campus Intelligence Engine..."

# 1. Kill any existing instances to avoid port conflicts
echo "🧹 Cleaning up previous instances..."
pkill -f "node server.js" || true
pkill -f "vite" || true

# 2. Wait for background cleanup
sleep 1

# 3. Start the Backend API (Port 5000)
echo "📡 Starting Backend API on http://localhost:5000..."
cd backend && npm run dev > /dev/null 2>&1 &
BACKEND_PID=$!

# 4. Wait for it to initialize
sleep 3
if curl -s http://localhost:5000/api/health | grep -q 'UniIssuehub API is running'; then
    echo "✅ [BACKEND] Success: AI Pipeline is online."
else
    echo "❌ [BACKEND] Error: Failed to start backend within 3 seconds."
fi

# 5. Start the Frontend (Port 5173 / 80)
echo "🎨 Starting Frontend UI on http://localhost:5173..."
cd frontend && npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!

echo "--------------------------------------------------------"
echo "🌟 System Launched! Access the app here:"
echo "👉  Frontend: http://localhost:5173"
echo "👉  Backend Health: http://localhost:5000/api/health"
echo "--------------------------------------------------------"
echo "Keep this terminal open during your demo."
echo "Press Ctrl+C to shut down all systems."

# Wait for Ctrl+C locally or keep background tasks alive
wait $BACKEND_PID $FRONTEND_PID
