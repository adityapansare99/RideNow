import dotenv from "dotenv";
import { app } from "./app.js";
import { connectdb } from "./db/index.js";
import http from "http";
import { initializeSocket, sendMessageToSocketId } from "./socket.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

const server = http.createServer(app);
initializeSocket(server);

connectdb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
