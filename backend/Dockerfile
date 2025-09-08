# Use official Node.js LTS image as base
FROM node:18-alpine

# Set work directory
WORKDIR /usr/src/app

# Copy root package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Copy backend source code
COPY backend ./backend

# Set working dir to backend for runtime
WORKDIR /usr/src/app/backend

# Expose backend port (default 4000)
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
