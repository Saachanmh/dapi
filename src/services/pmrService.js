import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://api.dapi.chloe.hervouet.mds-nantes.fr/api').replace(/\/$/, '');

/**
 * Récupère les places PMR à partir du backend
 * @param {Object} options - Options de recherche
 * @param {number} options.limit - Nombre de résultats à retourner
 * @param {number} options.offset - Décalage pour la pagination
 * @returns {Promise<Array>} - Tableau des places PMR
 */
export const getPMRLocations = async (options = {}) => {
  try {
    const { limit = 100, offset = 0 } = options;
    const response = await axios.get(`${API_BASE_URL}/emplacements`, {
      params: { limit, offset },
    });
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des places PMR:', error);
    throw error;
  }
};

/**
 * Récupère les places PMR avec filtrage par commune
 * @param {string} commune - Nom de la commune
 * @returns {Promise<Array>} - Tableau des places PMR filtrées
 */
export const getPMRByCommune = async (commune) => {
  try {
    const allLocations = await getAllPMRLocations();
    return allLocations.filter(loc =>
      loc.commune_nom?.toLowerCase().includes(commune.toLowerCase())
    );
  } catch (error) {
    console.error(`Erreur lors de la récupération des places PMR pour ${commune}:`, error);
    throw error;
  }
};

/**
 * Récupère toutes les places PMR depuis le backend
 * @returns {Promise<Array>} - Tableau de toutes les places PMR
 */
export const getAllPMRLocations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/emplacements`, {
      params: { limit: 1000 },
    });
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les places PMR:', error);
    throw error;
  }
};

/**
 * Formatte les données du backend pour la carte
 * @param {Array} pmrData - Données brutes du backend
 * @returns {Array} - Données formatées
 */
export const formatPMRData = (pmrData) => {
  return pmrData.map((location) => ({
    id: location.id,
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
    commune: location.commune_nom || 'Commune inconnue',
    adresse: location.adresse || 'Adresse inconnue',
    nombrePlaces: location.nombre_places || 0,
    duree: location.duree_stationnement || 'Non spécifiée',
    type: location.type_de_stationnement || 'Non spécifié',
  }));
};

/**
 * Synchronise les données depuis l'API Nantes Métropole vers la base de données
 * @returns {Promise<Object>} - Résultat de la synchronisation
 */
export const syncPMRData = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sync`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la synchronisation des données:', error);
    throw error;
  }
};
