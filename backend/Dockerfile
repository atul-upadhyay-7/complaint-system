# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only production if needed, but we often need full for dev or simple builds)
RUN npm install --production

# Copy source code
COPY . .

# Expose the API port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
