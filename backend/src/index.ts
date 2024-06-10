import express from 'express'
import "dotenv/config";
import { createServer } from 'http';
import { Server as ioServer } from 'socket.io'
import Cors from 'cors';

(() => {
  const app = express();
  const httpServer = createServer(app);
  const io = new ioServer(httpServer, {
    cors: {
      // origin: "http://localhost:3000",
      origin: "https://bdc5-70-50-195-136.ngrok-free.app",
      credentials: true
    }
  });
  const PORT = process.env.PORT;

  app.use(Cors({ origin: "http://localhost:3000" }));

  io.on("connection", socket => {
    console.log("Connected a user.")

    socket.on("disconnect", () => {
      console.log("User disconnected.")
    })
  })

  httpServer.listen(PORT, () => console.log(`UP! http://localhost:${PORT}`))
})()
