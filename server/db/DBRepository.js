const { Pool } = require('pg');

/**
 * @typedef DBUser
 * @type {object}
 * @property {int} id
 * @property {string} display_name
 * @property {string} username
 * @property {Buffer} password
 * @property {Buffer} salt
 */
class DBRepository {
  constructor() {
    this.pool = new Pool();
  }

  /**
   * 
   * @param {string} username 
   * @returns {DBUser} user
   */
  async getUserByUsername(username) {
    var result;
    try{
      result = await this.pool.query('SELECT * FROM USERS WHERE username = $1', [username]);
    } catch(e) {
      throw e;
    }
    return result.rows[0];
  }
  
  /**
   * 
   * @param {int} id User ID
   * @returns {DBUser} user
   */
  async getUserById(id) {
    var result;
    try {
      result = await this.pool.query('SELECT * FROM USERS WHERE id = $1', [id]);
    } catch(e) {
      throw e;
    }
    return result.rows[0];
  }

  /**
   * Registers user in database
   * @param {string} displayName User's (visible) display name
   * @param {string} username User's unique username
   * @param {Buffer} password User's hashed password
   * @param {Buffer} salt User's salt
   * @returns User id and display name
   */
  async register(displayName, username, password, salt) {
    var result;
    console.log(displayName, username, password, salt);
    try{
      result = await this.pool.query('INSERT INTO users (display_name, username, password, salt) VALUES ($1, $2, $3, $4) RETURNING id, display_name', [
        displayName,
        username,
        password,
        salt,
      ]);
    } catch(e) {
      throw e;
    }
    return result.rows[0];
  }
}
module.exports = new DBRepository();