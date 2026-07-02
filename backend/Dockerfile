# ---- Stage 1: install production dependencies ----
FROM node:22.23.1-alpine3.24 AS deps

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --no-audit --no-fund; else npm install --omit=dev --no-audit --no-fund; fi

# ---- Stage 2: minimal runtime image ----
FROM node:22.23.1-alpine3.24 AS runtime

WORKDIR /app

# Copier uniquement les node_modules de prod + le code source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Retirer npm/npx/yarn/corepack de l'image finale : ce sont eux qui
# embarquaient les paquets vulnérables (picomatch, sigstore), pas ton code.
# On n'en a pas besoin au runtime puisqu'on lance node directement.
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/bin/corepack \
    /opt/yarn-v*

# L'image officielle node:alpine fournit déjà un utilisateur non-root "node" (uid 1000)
USER node

EXPOSE 3001

# Remplace "server.js" par ton vrai point d'entrée si différent
CMD ["node", "server.js"]
