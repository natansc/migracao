# backend/Dockerfile

# Estágio 1: Build
FROM node:20-alpine AS builder
# Adicionado 'openssl' e as ferramentas de build
RUN apk add --no-cache python3 make g++ openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# GERA O PRISMA CLIENT AQUI:
RUN npx prisma generate
RUN npm run build

# Estágio 2: Produção
FROM node:20-alpine AS production
RUN apk add --no-cache python3 make g++ openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# Copia a pasta do Prisma e gera o client também para produção
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 3001
CMD ["node", "dist/main.js"]