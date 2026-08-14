import { Server } from "socket.io";
import { User } from "./model/user.model.js";
import { Captain } from "./model/captain.model.js";
import { Ride } from "./model/ride.model.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      try {
        if (userType === "user") {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (error) {
        socket.emit("error", { message: "Join failed. Please try again" });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        await Captain.findByIdAndUpdate(userId, {
          status: "active",
          location: {
            ltd: location.ltd,
            lng: location.lng,
          },
        });
      } catch (error) {
        console.error("Location update error:", error);
        socket.emit("error", {
          message: "Location update failed. Please try again",
        });
      }
    });

    socket.on("update-captain-location-ride", async (data) => {
      const { userId, location, rideId, heading } = data;

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

        const ride = await Ride.findById(rideId).populate("user");

        if (ride && ride.user && ride.user.socketId) {
          io.to(ride.user.socketId).emit("captain-location-update", {
            location: location,
            heading: heading,
            rideId: rideId,
          });
        }
      } catch (error) {
        console.error("Ride location update error:", error);
        socket.emit("error", {
          message: "Ride location update failed. Please try again",
        });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        await Captain.findOneAndUpdate(
          { socketId: socket.id },
          { status: "inactive", $unset: { socketId: "" } }
        );
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { $unset: { socketId: "" } }
        );
      } catch (error) {
        console.error("Disconnect cleanup error:", error);
      }
    });
  });
};

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

export { initializeSocket, sendMessageToSocketId };
