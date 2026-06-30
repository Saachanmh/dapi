import pool from '../config/database.js';

class Commune {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM communes ORDER BY nom');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM communes WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByNom(nom) {
    const [rows] = await pool.query('SELECT * FROM communes WHERE nom = ?', [nom]);
    return rows[0];
  }

  static async create(nom, codePostal) {
    const [result] = await pool.query(
      'INSERT INTO communes (nom, code_postal) VALUES (?, ?)',
      [nom, codePostal]
    );
    return result.insertId;
  }

  static async findOrCreate(nom, codePostal) {
    let commune = await this.findByNom(nom);
    if (!commune) {
      const id = await this.create(nom, codePostal);
      commune = await this.findById(id);
    }
    return commune;
  }
}

export default Commune;
