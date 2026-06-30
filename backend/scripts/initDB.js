import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  let connection;
  try {
    console.log('Configuration MySQL :');
    console.log('  Host:', process.env.DB_HOST);
    console.log('  User:', process.env.DB_USER);
    console.log('  Database:', process.env.DB_NAME);
    console.log('\nConnexion à MySQL...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✅ Connecté à MySQL !');

    console.log('Lecture du schéma SQL...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('Exécution du schéma...');
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✅ Base de données initialisée avec succès !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'initialisation de la base de données:');
    if (error.code) {
      console.error('  Code d\'erreur:', error.code);
    }
    if (error.errno) {
      console.error('  Numéro d\'erreur:', error.errno);
    }
    console.error('  Message:', error.message);
    console.error('\nVérifiez que:');
    console.error('  1. MySQL est installé et en cours d\'exécution');
    console.error('  2. Les identifiants dans backend/.env sont corrects');
    console.error('  3. L\'utilisateur a les droits nécessaires');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
