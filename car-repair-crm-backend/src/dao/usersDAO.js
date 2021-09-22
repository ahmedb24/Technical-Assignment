let users
let sessions

export default class UsersDAO {
  static async injectDB(conn) {
    if (users && sessions) {
      return
    }
    try {
      users = await conn.db(process.env.CRM_NS).collection("users")
      sessions = await conn.db(process.env.CRM_NS).collection("sessions")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  /**
   * Retrieves all users in the `users` collection
   * @returns {Object | null} Returns all users or nothing
   */
  static async getUsers() {
    return await users.find({ }).toArray();
  }

  /**
   * Gets a user by email
   * @param {string} email - The desired email
   * @returns {MflixMovie | null} Returns either a single user or nothing
   */
  static async getAUserByEmail(email) {
    try {
      return await users.findOne({ email: email });
    } catch (e) {
      console.error(`Something went wrong in getMovieByID: ${e}`)
      return null;
    }
  }
  
  /**
   * Adds a user to the `users` collection
   * @param {UserInfo} userInfo - The information of the user to add
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addUser(userInfo) {
    try {
      // Insert a user with the "name", "email", "password", diagnosed, diagnosisDetail fields.
      await users.insertOne({ name: userInfo.name, email: userInfo.email, password: userInfo.password }, {w: "majority"})
      return { success: true }
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return { error: "A user with the given email already exists." }
      }
      console.error(`Error occurred while adding new user, ${e}.`)
      return { error: e }
    }
  }

  /**
   * Adds a user to the `sessions` collection
   * @param {string} email - The email of the user to login
   * @param {string} jwt - A JSON web token representing the user's claims
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async loginUser(email, jwt) {
    try {
      await sessions.updateOne(
        { user_id: email },
        { $set: { jwt } },
        { upsert: true }
      )
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while logging in user, ${e}`)
      return { error: e }
    }
  }

  /**
   * Removes a user from the `sessons` collection
   * @param {string} email - The email of the user to logout
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async logoutUser(email) {
    try {
      await sessions.deleteOne({ user_id: email })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while logging out user, ${e}`)
      return { error: e }
    }
  }

  /**
   * Gets a user from the `sessions` collection
   * @param {string} email - The email of the user to search for in `sessions`
   * @returns {Object | null} Returns a user session Object, an "error" Object
   * if something went wrong, or null if user was not found.
   */
  static async getUserSession(email) {
    try {
      // Retrieve the session document corresponding with the user's email.
      return sessions.findOne({ user_id: email })
    } catch (e) {
      console.error(`Error occurred while retrieving user session, ${e}`)
      return null
    }
  }

  /**
   * Removes a user from the `sessions` and `users` collections
   * @param {string} email - The email of the user to delete
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteUser(email) {
    try {
      await users.deleteOne({ email })
      await sessions.deleteOne({ user_id: email })
      if (!(await this.getAUserByEmail(email)) && !(await this.getUserSession(email))) {
        return { success: true }
      } else {
        console.error(`Deletion unsuccessful`)
        return { error: `Deletion unsuccessful` }
      }
    } catch (e) {
      console.error(`Error occurred while deleting user, ${e}`)
      return { error: e }
    }
  }

  /**
   * Given a user's email and an object of new preferences, update that user's
   * data to include those preferences.
   * @param {string} email - The email of the user to update.
   * @param {Object} preferences - The preferences to include in the user's data.
   * @returns {DAOResponse}
   */
  static async updatePreferences(email, preferences) {
    try {
      preferences = preferences || {}

      const updateResponse = await users.updateOne(
        { email },
        { $set: { preferences } }
      );

      if (updateResponse.matchedCount === 0) {
        return { error: "No user found with that email" }
      }
      return updateResponse
    } catch (e) {
      console.error(
        `An error occurred while updating this user's preferences, ${e}`
      )
      return { error: e }
    }
  }

  static async checkAdmin(email) {
    try {
      const { isAdmin } = await this.getAUserByEmail(email)
      console.log(isAdmin)
      return isAdmin || false
    } catch (e) {
      return { error: e }
    }
  }

  static async makeAdmin(email) {
    try {
      const updateResponse = users.updateOne(
        { email },
        { $set: { isAdmin: true } },
      )
      return updateResponse
    } catch (e) {
      return { error: e }
    }
  }
}

/**
 * Parameter passed to addUser method
 * @typedef UserInfo
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {boolean} diagnosed
 * @property {Object} diagnosisDetail
 */

/**
 * Success/Error return object
 * @typedef DAOResponse
 * @property {boolean} [success] - Success
 * @property {string} [error] - Error
 */