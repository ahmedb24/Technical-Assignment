// const express = require('express');
// const app = express();
// const path = require('path');
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// app.get('/', (req, res) => {
//   console.log('got req'+req.body)  
//   res.sendFile(path.join(__dirname, '../build/index.html'))
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });  

// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });



import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan";
import messages from  "./api/messages.route";
const app = express()
const http = require('http');
const server = http.createServer(app);



app.use(cors())
process.env.NODE_ENV !== "prod" && app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Register api routes
app.use("/", express.static("build"))
app.use("/messages", messages)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))


// export default app
export default server