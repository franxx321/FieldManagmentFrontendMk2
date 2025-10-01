FROM node:20-bookworm-slim AS deps
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
#RUN pnpm install --frozen-lockfile
RUN pnpm install

FROM node:20-bookworm-slim AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json .
COPY . .
# Build-time base path. For subdomain, pass empty or omit.
ARG NEXT_PUBLIC_BACKEND_PATH
ENV NEXT_PUBLIC_BACKEND_PATH=${NEXT_PUBLIC_BACKEND_PATH}
RUN npm install -g pnpm
RUN pnpm build

FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
# Optional: non-root user
RUN useradd -m nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]


