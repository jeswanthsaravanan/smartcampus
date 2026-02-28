FROM node:20-alpine

WORKDIR /app

# Copy backend-node files
COPY backend-node/package*.json ./
RUN npm install --production

COPY backend-node/ ./

EXPOSE 8080

CMD ["node", "server.js"]
