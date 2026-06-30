import EmplacementPMR from '../models/EmplacementPMR.js';
import Commune from '../models/Commune.js';
import axios from 'axios';

const NANTES_METROPOLE_API = 'https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_emplacements-pmr-nantes-metropole/records';

export const getPMRLocations = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const locations = await EmplacementPMR.findAll({ limit: parseInt(limit), offset: parseInt(offset) });
    res.json(locations);
  } catch (error) {
    console.error('Erreur lors de la récupération des emplacements PMR:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const getPMRById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await EmplacementPMR.findById(id);
    if (!location) {
      return res.status(404).json({ error: 'Emplacement non trouvé' });
    }
    res.json(location);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emplacement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const syncPMRData = async (req, res) => {
  try {
    let allResults = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    console.log('Récupération des données depuis l\'API Nantes Métropole...');

    while (hasMore) {
      const response = await axios.get(NANTES_METROPOLE_API, {
        params: { limit, offset }
      });

      const results = response.data.results || [];
      allResults = allResults.concat(results);
      
      console.log(`  - Récupérés ${results.length} enregistrements (total: ${allResults.length})`);
      
      hasMore = results.length === limit;
      offset += limit;
      
      // Petite pause pour éviter de surcharger l'API
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`\nEnregistrement des ${allResults.length} emplacements dans la base de données...`);

    let savedCount = 0;
    for (const item of allResults) {
      if (!item.record_id) {
        console.log(`  - Ignoré un enregistrement sans ID`);
        continue;
      }
      
      const commune = await Commune.findOrCreate(item.commune, null);
      
      await EmplacementPMR.create({
        id: item.record_id,
        latitude: item.geo_point_2d?.lat || 0,
        longitude: item.geo_point_2d?.lon || 0,
        adresse: item.adresse || '',
        nombrePlaces: item.nombre_places || 0,
        dureeStationnement: item.duree_stationnement || '',
        typeStationnement: item.type_de_stationnement || '',
        communeId: commune.id
      });
      savedCount++;
    }
    console.log(`✅ ${savedCount} emplacements enregistrés`);

    res.json({ message: 'Données synchronisées avec succès', count: allResults.length });
  } catch (error) {
    console.error('Erreur lors de la synchronisation des données:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la synchronisation' });
  }
};

export const getCommunes = async (req, res) => {
  try {
    const communes = await Commune.findAll();
    res.json(communes);
  } catch (error) {
    console.error('Erreur lors de la récupération des communes:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
