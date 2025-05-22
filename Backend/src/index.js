import dotenv from "dotenv";
import { app } from "./app.js";
import { connectdb } from "./db/index.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT || 8000;

connectdb()
  .then(() => {
    app.listen(port, () => {
      console.log(`http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.log("something went wrong....", err);
  });
