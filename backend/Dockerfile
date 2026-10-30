services:
  db:
    image: docker.io/library/postgres:15-alpine
    container_name: app-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: sua_senha_forte_aqui
      POSTGRES_DB: trinus_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build: ./backend
    container_name: app-backend
    restart: unless-stopped
    environment:
      - PORT=3001
      - NODE_ENV=production
      # O host aqui é 'db', que é o nome do serviço ali em cima!
      - DATABASE_URL=postgresql://admin:sua_senha_forte_aqui@db:5432/trinus_db?schema=public
    depends_on:
      - db
    ports:
      - "127.0.0.1:3001:3001"
    networks:
      - app-network

# ... (frontend e networks)

volumes:
  postgres_data: