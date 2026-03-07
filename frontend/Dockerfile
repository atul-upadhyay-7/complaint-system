# Stage 1: Build static assets
FROM node:18-alpine AS build

# Build-time argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (needed for build)
RUN npm install

# Copy source
COPY . .

# Build the app with Vite - the ENV will be picked up by Vite
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build artifacts from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (default for Nginx is 80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
