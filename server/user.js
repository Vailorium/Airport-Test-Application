/**
 * @typedef UserProfile
 * @type {object}
 * @property {string} displayName
 */

/**
 * Gets the user profile from the database user object
 * @param {import("./db/DBRepository").DBUser} user User object returned from database
 * @returns User profile
 */
function getUserProfile(user) {
  return {
    displayName: user.display_name,
  }
}

module.exports = {
  getUserProfile,
}