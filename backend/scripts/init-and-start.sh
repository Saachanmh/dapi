#!/bin/sh

# Attendre que la base de données soit prête
echo "Attente de la base de données..."
while ! node -e "
const mysql = require('mysql2/promise');
mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dapi_pmr'
}).then(conn => {
  conn.end();
  process.exit(0);
}).catch(() => process.exit(1));
" 2>/dev/null; do
  sleep 2
done

echo "Base de données prête !"

# Démarrer le serveur
exec node server.js
