import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  console.log('Test de connexion MySQL...');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  User:', process.env.DB_USER);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    console.log('✅ Connexion réussie !');
    
    console.log('\nRécupération des bases de données...');
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('Bases de données disponibles:');
    databases.forEach(db => console.log('  -', db.Database));
    
    await connection.end();
  } catch (err) {
    console.error('\n❌ Erreur de connexion:');
    console.error('  Code:', err.code);
    console.error('  Message:', err.message);
    console.error('\nVoir DEPANNAGE.md pour résoudre le problème.');
  }
}

test();
