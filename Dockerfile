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

# Production stage
FROM oven/bun:1-slim AS release
WORKDIR /app

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static .next/static
COPY --from=builder /app/public public
COPY --from=builder /app/lib/og/*.ttf lib/og/

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD bun -e "const r=await fetch('http://localhost:3000');if(!r.ok)process.exit(1)"

CMD ["server.js"]
