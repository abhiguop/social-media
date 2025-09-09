FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend code
COPY backend ./backend

WORKDIR /usr/src/app/backend

EXPOSE 4000

CMD ["node", "server.js"]
