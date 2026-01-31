# Multi-stage build for production
FROM node:20-alpine AS builder

# Install dependencies for client build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./

# Copy built client files
COPY --from=builder /app/client/dist ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run server
CMD ["node", "server.js"]
