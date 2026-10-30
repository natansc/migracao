# backend/Dockerfile

# Estágio 1: Build
FROM node:20-alpine AS builder
# Adiciona openssl e ferramentas de compilação
RUN apk add --no-cache python3 make g++ openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Gera o Prisma Client ANTES de compilar o NestJS
RUN npx prisma generate
RUN npm run build

# Estágio 2: Produção
FROM node:20-alpine AS production
# O Prisma precisa do openssl também em produção
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# COPIA A PASTA PRISMA ANTES DE GERAR O CLIENT
COPY --from=builder /app/prisma ./prisma
# Gera o Prisma Client para o ambiente de produção
RUN npx prisma generate
EXPOSE 3001
CMD ["node", "dist/main.js"]