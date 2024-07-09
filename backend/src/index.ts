import "dotenv/config"
import express from "express";
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "https://efd8-70-50-195-136.ngrok-free.app",
    origin: "http://localhost:3000",
    credentials: true
  }
});

(() => {

  io.on("connection", socket => {
    socket.on("dial", async (data, callback) => {

      const { _callerId, receiverId } = data;
      try {
        const res = await socket.to(receiverId).timeout(3000).emitWithAck("dial-res", data);
        if (res)
          return callback({ data, status: res[0].status, message: res[0].status ? "User Pick-Up, wait for connecting." : "User didn't pick-up" })
      } catch (error: any) {
        if (error)
          return callback({ data, status: false, message: "User Unavailable." })
      }

    }
    )
    socket.emit("me", socket.id);

    socket.on("rtc-sd", (data) => {
      const { sessionDp } = data;
      socket.broadcast.emit("rtc-sd", { sessionDp: sessionDp })

    })

    socket.on("ice-cd", (data) => {
      const { iceCd } = data;
      socket.broadcast.emit("ice-cd", { iceCd: iceCd })
    })

  })

  httpServer.listen(PORT, () => {
    console.log(`UP! http://localhost:${PORT}`)
  })
})()
