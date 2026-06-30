# Dockerfile multistage pour le backend

# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (production uniquement pour réduire la taille)
RUN npm ci --only=production

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Copier les dépendances depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Commande de démarrage
CMD ["node", "server.js"]
