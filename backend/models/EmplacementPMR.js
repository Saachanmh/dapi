import pool from '../config/database.js';

class EmplacementPMR {
  static async findAll(options = {}) {
    const { limit = 100, offset = 0 } = options;
    const [rows] = await pool.query(`
      SELECT e.*, c.nom as commune_nom 
      FROM emplacements_pmr e
      LEFT JOIN communes c ON e.commune_id = c.id
      ORDER BY c.nom, e.adresse
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT e.*, c.nom as commune_nom 
      FROM emplacements_pmr e
      LEFT JOIN communes c ON e.commune_id = c.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByCommune(communeId) {
    const [rows] = await pool.query(`
      SELECT e.*, c.nom as commune_nom 
      FROM emplacements_pmr e
      LEFT JOIN communes c ON e.commune_id = c.id
      WHERE e.commune_id = ?
      ORDER BY e.adresse
    `, [communeId]);
    return rows;
  }

  static async create(data) {
    const { id, latitude, longitude, adresse, nombrePlaces, dureeStationnement, typeStationnement, communeId } = data;
    const [result] = await pool.query(
      `INSERT INTO emplacements_pmr 
       (id, latitude, longitude, adresse, nombre_places, duree_stationnement, type_de_stationnement, commune_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       latitude = VALUES(latitude),
       longitude = VALUES(longitude),
       adresse = VALUES(adresse),
       nombre_places = VALUES(nombre_places),
       duree_stationnement = VALUES(duree_stationnement),
       type_de_stationnement = VALUES(type_de_stationnement),
       commune_id = VALUES(commune_id)`,
      [id, latitude, longitude, adresse, nombrePlaces, dureeStationnement, typeStationnement, communeId]
    );
    return result;
  }
}

export default EmplacementPMR;
