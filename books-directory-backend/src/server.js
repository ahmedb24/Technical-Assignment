import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"
import books from  "./api/books.route";
import users from  "./api/users.route";
const app = express()
const http = require('http');
const server = http.createServer(app);



app.use(cors())
process.env.NODE_ENV !== "prod" && app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Register api routes
app.use("/", express.static("build"))
app.use("/books", books)
app.use("/user", users)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

// export default app
export default server