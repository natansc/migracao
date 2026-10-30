# backend/Dockerfile

# Estágio 1: Build
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y python3 make g++ openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Gera o Prisma Client
RUN npx prisma generate
# Compila o NestJS
RUN npm run build

# Estágio 2: Produção
FROM node:20-slim AS production
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# A MÁGICA ACONTECE AQUI: Copia o Prisma Client já gerado do estágio anterior
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copia o código compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]