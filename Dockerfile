# Build stage
FROM oven/bun:1-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Production stage - use distroless for minimal size
FROM oven/bun:1-distroless AS release
WORKDIR /app

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static .next/static
COPY --from=builder /app/public public

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["server.js"]
