import { Router } from "express"
import MessagesCtrl from "./messages.controller"

const router = new Router()

// associate put, delete, and get(id)
router.route("/").get(MessagesCtrl.apiGetMessages)
router.route("/").post(MessagesCtrl.apiPostMessage)

export default router