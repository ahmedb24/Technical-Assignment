let messages

export default class MessagesDAO {
  static async injectDB(conn) {
    if (messages) {
      return
    }
    try {
        messages = await conn.db(process.env.MYCHAT_NS).collection("messages")
    } catch (e) {
      console.error(`Unable to establish collection handles in messageDAO: ${e}`)
    }
  }

  static async getMessages() {
    try {
        const displayCursor = await messages.find({});
        
        const messagesList = await displayCursor.toArray();
        const totalNumMessages = messagesList.length;

        return {messagesList, totalNumMessages}
    } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return { messagesList: [], totalNumMessages: 0 }
    }
  }

  static async addMessage(name, message, date) {
    try {
      const messageDoc = { name, message, date }
      const insertResult = await messages.insertOne(messageDoc)
      console.error(insertResult)
      if (insertResult.insertedCount !== 1) {
        return {error: 'could not post message'}
      }
      return messageDoc;
    } catch (e) {
      console.error(`Unable to post message: ${e}`)
      return { error: e }
    }
  }
}