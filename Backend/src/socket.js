import { Server } from "socket.io";
import { User } from "./model/user.model.js";
import { Captain } from "./model/captain.model.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async (data) => {
      const { userId, userType } = data;

      try {
        if (userType === "user") {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (error) {
        console.error("Join error:", error);
        socket.emit("error", { message: "Join failed", error });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        await Captain.findByIdAndUpdate(userId, {
          location: {
            ltd: location.ltd,
            lng: location.lng,
          },
        });
      } catch (error) {
        console.error("Location update error:", error);
        socket.emit("error", { message: "Location update failed", error });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log("Sending message:", messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

export { initializeSocket, sendMessageToSocketId };
