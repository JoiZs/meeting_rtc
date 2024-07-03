import "dotenv/config"
import express from "express";
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {});

(() => {

  io.on("connection", socket => {

  })

  httpServer.listen(PORT, () => {
    console.log(`UP! http://localhost:${PORT}`)
  })
})()
