# syntax=docker/dockerfile:1

# -------- Build stage --------
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies using npm (avoids pnpm lock mismatch)
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy package files for production dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.* ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app
USER nextjs

# Expose Next.js default port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start Next.js in production mode
CMD ["npm", "start"]
