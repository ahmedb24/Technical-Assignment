import { Router } from "express"
import BooksCtrl from "./books.controller"

const router = new Router();

// associate put, delete, and get(id)
router.route("/").get(BooksCtrl.apiGetBooks)
router.route("/id/:id").get(BooksCtrl.apiGetBookById)
router.route("/").post(BooksCtrl.apiPostBook)
router.route("/").put(BooksCtrl.apiUpdateBook)
router.route("/").delete(BooksCtrl.apiDeleteBook)

export default router