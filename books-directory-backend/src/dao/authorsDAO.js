import { ObjectId } from "bson"

let authors

export default class AuthorsDAO {
  static async injectDB(conn) {
    if (authors) {
      return
    }
    try {
        authors = await conn.db(process.env.BOOKSDIRECTORY_NS).collection("authors")
    } catch (e) {
      console.error(`Unable to establish collection handles in authorsDAO: ${e}`)
    }
  }

  static async getAuthor(author_name) {
    try {
      return await authors.findOne({ name: author_name })
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return null;
    }
  }

  static async addAuthor(name, date_of_birth) {
    try {
      // Construct the author document to be inserted into MongoDB.
      const authorDoc = { name: name, date_of_birth: date_of_birth }
      return await authors.insertOne(authorDoc)
    } catch (e) {
      console.error(`Unable to post author: ${e}`)
      return { error: e }
    }
  }

  static async updateAuthor(authorId, name, date_of_birth) {
    try {
      const updateResponse = await authors.updateOne(
        { _id: ObjectId(authorId),  },
        { $set: { name, date_of_birth } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update author: ${e}`)
      return { error: e }
    }
  }
}