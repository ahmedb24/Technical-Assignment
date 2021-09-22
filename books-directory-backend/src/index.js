import { MongoClient } from "mongodb"
import server from "./server"
import BooksDAO from "./dao/BooksDAO";
import AuthorsDAO from "./dao/authorsDAO";
import UsersDAO from "./dao/usersDAO";

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.BOOKSDIRECTORY_DB_URI
    )
    .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
      await BooksDAO.injectDB(client)
      await AuthorsDAO.injectDB(client)
      await UsersDAO.injectDB(client)
      
      server.listen(port, () => {
        console.log(`listening on port ${port}`)
      })
  })