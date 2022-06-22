const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Private key
const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * @typedef UserProfile
 * @type {object}
 * @property {string} displayName
 * @property {boolean} isAdmin
 */

/**
 * Gets the user profile from the database user object
 * @param {import("./db/DBRepository").DBUser} user User object returned from database
* @returns {UserProfile} User profile
 */
function getUserProfile(user) {
  return {
    displayName: user.display_name,
    isAdmin: user.is_admin,
  }
}

/**
 * 
 * @param {import('../db/DBRepository').DBUser} user User data from DB
 */
function issueJWT(user) {
  const id = user.id;

  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return signedToken;
}

module.exports = {
  getUserProfile,
  issueJWT,
};