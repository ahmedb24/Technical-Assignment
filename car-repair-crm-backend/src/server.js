import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
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
app.use("/users", users)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default server