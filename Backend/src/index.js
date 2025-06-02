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

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`); // Server is listening on );
});

connectdb()
  .then(() => {
    app.listen(port, () => {
      console.log(`http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.log("something went wrong....", err);
  });
