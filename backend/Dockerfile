# backend/Dockerfile

# Estágio 1: Build
FROM node:20-slim AS builder
# Instala ferramentas de compilação para o Debian (slim)
RUN apt-get update && apt-get install -y python3 make g++ openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Estágio 2: Produção
FROM node:20-slim AS production
# O Prisma precisa do openssl também em produção
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 3001
CMD ["node", "dist/main.js"]