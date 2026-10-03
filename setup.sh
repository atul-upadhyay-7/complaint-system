#!/bin/bash

# --- Uniissuehub Auto-Setup Tool ---

# Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🎓 Uniissuehub — EliteCoder Hackathon Setup${NC}"
echo -e "${CYAN}------------------------------------------${NC}"

# 1. Install root dependencies
echo -e "${BLUE}[1/4] Installing root manager...${NC}"
npm install

# 2. Install backend dependencies & create .env
echo -e "${BLUE}[2/4] Setting up Backend...${NC}"
cd backend
npm install
if [ ! -f .env ]; then
    echo -e "${GREEN}Creating .env from .env.example...${NC}"
    cp .env.example .env
fi
cd ..

# 3. Install frontend dependencies
echo -e "${BLUE}[3/4] Setting up Frontend...${NC}"
cd frontend
npm install
cd ..

# 4. Final steps
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${CYAN}To start the platform (Frontend + Backend):${NC}"
echo -e "  ${PURPLE}npm run dev${NC}"
echo ""
echo -e "${CYAN}To seed demo data (Admin, Student, Samples):${NC}"
echo -e "  ${PURPLE}npm run seed${NC}"
echo ""
echo -e "${BLUE}Docs: http://localhost:5173${NC}"
echo -e "${CYAN}------------------------------------------${NC}"
