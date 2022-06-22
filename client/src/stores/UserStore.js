const axios = require('axios').default;

/**
 * @typedef User
 * @type {object}
 * @property {string} displayName User's public display name
 */
class UserStore {
  constructor() {
    this.state = {
      user: {
        displayName: '',
      }
    }

    this.preloadUser();
  }
  
  async preloadUser() {
    if(!this.state.user.displayName) {
      await axios.get(`/auth/profile`, { withCredentials: true })
        .then((res) => {
          if(res.status === 200) {
            this.setUser(res.data.user);
          } else {
            // redirect to login
            console.error(res.data);
          }
        });
    }
  }

  /**
   * Sets user state
   * @param {User} user 
   */
  setUser(user) {
    this.state.user = user;
  }

  /**
   * Gets user, if user isn't loaded then attempts to load user profile
   * @returns {User}
   */
  getUser() {
    return this.state.user;
  }
}
export default new UserStore();