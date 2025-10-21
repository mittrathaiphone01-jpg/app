# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "run", "start"]