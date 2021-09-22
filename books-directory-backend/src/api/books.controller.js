import AuthorsDAO from '../dao/authorsDAO';
import BooksDAO from '../dao/BooksDAO';
import { User } from './users.controller';
import {ObjectId} from 'bson';

export default class MessagesController {
    static async apiGetBooks(req, res, next) {
        const BOOKS_PER_PAGE = 20
        const { booksList, totalNumBooks } = await BooksDAO.getBooks()
        let response = {
          books: booksList,
          entries_per_page: BOOKS_PER_PAGE,
          total_results: totalNumBooks,
        }
        res.json(response);
    }

    static async apiGetBookById(req, res, next) {
      try {
        let id = req.params.id || {}
        let book = await BooksDAO.getBookByID(id)
        if (!book) {
          res.status(404).json({ error: "Not found" })
          return
        }
        let updated_type = book.lastupdated instanceof Date ? "Date" : "other"
        res.json({ book, updated_type });
      } catch (e) {
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
      }
    }

    static async apiPostBook(req, res, next) {
      try {
        if (!req.get("Authorization" || req.get("Authorization").indexOf("Bearer ") === -1)) {
          res.status(401).json({ error: "Invalid auth provided, please login to continue" })
          return;
        }
        const userJwt = req.get("Authorization").slice("Bearer ".length)
        const user = await User.decoded(userJwt)
        var err = user.error
        if (err) {
          res.status(401).json({ err })
          return
        }

        const title = typeof(req.body.title) == 'string' && req.body.title.length > 3 ? req.body.title : false;
        const summary = typeof(req.body.summary) == 'string' && req.body.summary.length > 3 ? req.body.summary : false;
        const author_name = typeof(req.body.author_name) == 'string' && req.body.author_name.length > 3 ? req.body.author_name : false;
        const author_dob = typeof(req.body.author_dob) == 'string' && req.body.author_dob.length === 10 ? req.body.author_dob : false;
        
        const errors = {};
        if (!title || !summary || !author_name || !author_dob) {
          errors.general = "Missing or Invalid required field(s)"
        }
        
        if (Object.keys(errors).length > 0) {
          res.status(400).json(errors)
          return
        }
        
        const authorInsertResult = await AuthorsDAO.addAuthor(author_name, author_dob)
        const authorCreateError = authorInsertResult.error;
        if (authorCreateError) {
          errors.authorCreate = authorCreateError;
        }
        
        if (Object.keys(errors).length > 0) {
          res.status(400).json(errors)
          return
        }

        const author = authorInsertResult.insertedId;
        const lastupdated = new Date();
        
        const bookInsertResult = await BooksDAO.addBook(
          title,
          summary,
          author,
          lastupdated
        )

        if (!bookInsertResult.insertedCount) {
          errors.bookCreate = bookInsertResult.error;
        }

        const insertedBookFromDB = await BooksDAO.getBookByID(bookInsertResult.insertedId);
  
        if (!insertedBookFromDB) {
          res.status(500).json({error: "An internal error occured, please try again later"})
          return;
        }
        
        res.json({ status: "success", insertedBook: insertedBookFromDB })
      } catch (e) {
        console.log('er: ', e);
        res.status(500).json({ e })
      }
    }

    static async apiUpdateBook(req, res, next) {
      try {
        const userJwt = req.get("Authorization").slice("Bearer ".length)
        const user = await User.decoded(userJwt)
        var { error } = user
        if (error) {
          res.status(401).json({ error })
          return
        }

        const bookId = typeof(req.body.book_id) == 'string' && req.body.book_id.length > 3 ? req.body.book_id : false;
        const title = typeof(req.body.title) == 'string' && req.body.title.length > 3 ? req.body.title : false;
        const summary = typeof(req.body.summary) == 'string' && req.body.summary.length > 3 ? req.body.summary : false;
        const author_name = typeof(req.body.author_name) == 'string' && req.body.author_name.length > 3 ? req.body.author_name : false;
        const author_dob = typeof(req.body.author_dob) == 'string' && req.body.author_dob.length === 10 ? req.body.author_dob : false;
        
        const errors = {};
        if (!bookId || !title || !summary || !author_name || !author_dob) {
          errors.general = "Missing or Invalid required field(s)"
        }
        
        if (Object.keys(errors).length > 0) {
          res.status(400).json(errors)
          return
        }
        
        const bookFromDB = await BooksDAO.getBookByID(bookId);

        if (!bookFromDB) {
          res.status(500).json({error: "An internal error occured, please try again later"})
          return;
        }
        
        const authorUpdateResult = await AuthorsDAO.updateAuthor(bookFromDB.author[0]._id, author_name, author_dob)
        
        const authorUpdateResultError = authorUpdateResult.error
        if (authorUpdateResultError) {
          res.status(400).json({error: "Invalid author details"});
          return;
        }
        
        const lastupdated = new Date()
        
        const bookResponse = await BooksDAO.updateBook(
          bookId,
          title,
          summary,
          lastupdated
          )
          
          const bookResponseError = bookResponse.error;
          if (bookResponseError) {
            res.status(400).json({ "error": bookResponseError })
            return
          }
          
        if (bookResponse.modifiedCount === 0) {
          throw new Error(
            "unable to update book",
            )
          }
          
        const updatedBook = await BooksDAO.getBookByID(bookId)
        res.json({ updatedBook: updatedBook })
      } catch (e) {
        console.log(e);
        res.status(500).json({ e })
      }
    }
  
    static async apiDeleteBook(req, res, next) {
      try {
        const userJwt = req.get("Authorization").slice("Bearer ".length)
        const user = await User.decoded(userJwt)
        var err = user.error;
        if (err) {
          res.status(401).json({ err })
          return
        }
  
        const bookId = typeof(req.body.book_id) == 'string' && req.body.book_id.length > 3 ? req.body.book_id : false;
        const { error } = await BooksDAO.deleteBook(
          bookId
        )

        if (error) {
          res.status(400).json(error)
        }
  
        res.json({ success: true })
      } catch (e) {
        res.status(500).json({ e })
      }
    }
}
