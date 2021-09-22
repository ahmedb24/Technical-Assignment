import { MongoClient } from "mongodb"
import MessagesDAO from "./dao/messagesDAO"
import server from "./server"
const { Server } = require("socket.io");
const io = new Server(server);
import MessagesCtrl from "./api/messages.controller"

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.MYCHAT_DB_URI
    )
    .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
      await MessagesDAO.injectDB(client)
      
      server.listen(port, () => {
        console.log(`listening on port ${port}`)
      })
      
      io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('getChats', () => {
          MessagesCtrl.apiGetMessagesViaSocket(socket);
        });

        socket.on('postChat', (message) => {
          MessagesCtrl.apiPostMessageViaSocket(socket, message);
        });

    })
  });  