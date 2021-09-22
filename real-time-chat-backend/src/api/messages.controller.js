import MessagesDAO from '../dao/messagesDAO';

export default class MessagesController {
    static async apiGetMessages(req, res, next) {
        const MESSAGES_PER_PAGE = 20
        const { messagesList, totalNumMessages } = await MessagesDAO.getMessages()
        let response = {
          messages: messagesList,
          entries_per_page: MESSAGES_PER_PAGE,
          total_results: totalNumMessages,
        }
        console.log('messagesList', response)
        res.sendStatus(200);
    }

    static async apiPostMessage(req, res, next) {
      try {
  
        const name = req.body.name
        const message = req.body.message
        const date = new Date()
  

        const messageResponse = await MessagesDAO.addMessage(
          name,
          message,
          date,
        )

        if (!messageResponse) {
          res.status(500);
        }
        
        io.emit('messagePost', messageResponse);
  
        res.sendStatus(200); 
      } catch (e) {
        res.status(500).json({ e })
      }
    }

    static async apiGetMessagesViaSocket(socket) {
      const MESSAGES_PER_PAGE = 20;
      const { messagesList, totalNumMessages } = await MessagesDAO.getMessages()
        let response = {
          messages: messagesList,
          entries_per_page: MESSAGES_PER_PAGE,
          total_results: totalNumMessages,
        }

        socket.emit('getChats', response);
    }

    static async apiPostMessageViaSocket(socket, message) {
      let inMesage = message

      try {
        const name = inMesage.name;
        const message = inMesage.message;
        const date = new Date()
  

        const messageResponse = await MessagesDAO.addMessage(
          name,
          message,
          date,
        )

        socket.emit('postChat', messageResponse);
      } catch (e) {
        socket.emit('postMessage', 'Could not save message');
        console.log(e);
      }
    }
}
