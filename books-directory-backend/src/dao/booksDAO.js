import { ObjectId } from "bson"
let books

export default class BooksDAO {
  static async injectDB(conn) {
    if (books) {
      return
    }
    try {
      books = await conn.db(process.env.BOOKSDIRECTORY_NS).collection("books")
    } catch (e) {
      console.error(`Unable to establish collection handles in booksDAO: ${e}`)
    }
  }
  
  static async getBooks() {
    try {
      const displayCursor = await books.find({});
        
      const booksList = await displayCursor.toArray();
      const totalNumbooks = booksList.length;
      
      return {booksList, totalNumbooks}
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { booksList: [], totalNumbooks: 0 }
    }
  }

  static async getBookByID(id) {
    try {
      const pipeline = [
          {
            $match: {
              _id: ObjectId(id)
            }
          },
          {
            $lookup: {
              from: 'authors',
              let: {'author_id': '$author'},
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$author_id']
                    }
                  }
                }
              ],
              as: 'author'
            }
          }
        ]
        return await books.aggregate(pipeline).next()
      } catch (e) {
        console.error(`Something went wrong in getBookByID: ${e}`)
        return null;
      }
  }
  

  static async addBook(title, summary, author, lastupdated) {
    try {
      const bookDoc = { title, summary, author, lastupdated }
      const insertResult = await books.insertOne(bookDoc)
      console.error(insertResult)
      if (insertResult.insertedCount !== 1) {
        return {error: 'could not post message'}
      }
      return insertResult;
    } catch (e) {
      console.error(`Unable to post message: ${e}`)
      return { error: e }
    }
  }

  static async updateBook(bookId, title, summary, lastupdated) {
    try {

      const updateResponse = await books.updateOne(
        { _id: ObjectId(bookId) },
        { $set: { title, summary, lastupdated } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update book: ${e}`)
      return { error: e }
    }
  }


  static async deleteBook(bookId) {
    try {
      const deleteResponse = await books.deleteOne({
        _id: ObjectId(bookId),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete book: ${e}`)
      return { error: e }
    }
  }
}