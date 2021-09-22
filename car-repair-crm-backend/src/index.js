import { MongoClient } from "mongodb"
import server from "./server"
import UsersDAO from "./dao/usersDAO"

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.CRM_DB_URI
    )
    .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
      await UsersDAO.injectDB(client)
      server.listen(port, () => {
        console.log(`listening on port ${port}`)
      })
  });