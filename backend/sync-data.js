import axios from 'axios';

const API_URL = 'http://localhost:3001/api/sync';

async function syncData() {
  try {
    console.log('Synchronisation des données en cours...');
    const response = await axios.post(API_URL);
    console.log('✅', response.data);
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

syncData();
