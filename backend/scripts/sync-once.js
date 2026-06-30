import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

async function waitForBackend() {
  console.log('Attente du backend...');
  let retries = 30;
  while (retries > 0) {
    try {
      await axios.get(`${API_BASE_URL}/`);
      console.log('Backend prêt !');
      return;
    } catch (error) {
      retries--;
      console.log(`Encore ${retries} essais restants...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Timeout en attente du backend');
}

async function syncData() {
  try {
    console.log('Synchronisation des données...');
    const response = await axios.post(`${API_BASE_URL}/api/sync`);
    console.log('✅', response.data);
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error.response?.data || error.message);
    process.exit(1);
  }
}

waitForBackend().then(syncData);
