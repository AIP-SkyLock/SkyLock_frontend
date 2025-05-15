# Base image
FROM node:24-slim as builder


# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build the Next.js app
RUN npm run build
RUN npx next telemetry disable

# ─────────────────────────────────────────────────────

# Production image
FROM node:24-slim as runner

WORKDIR /app

# Copy only needed files from the builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules


# RUN npm ci --legacy-peer-deps
# Set environment variable

RUN npx next telemetry disable
ENV NODE_ENV=production
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

# Expose app port
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "start"]
