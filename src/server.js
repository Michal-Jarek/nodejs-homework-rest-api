import { app } from "./app.js";
import mongoose from "mongoose";
import { UPLOAD_DIRECTORY,  AVATARS_DIRECTORY } from "./middlewares.js";
import { initializeDirectory } from "./utils.js";

app.listen(3000, async () => {
  await initializeDirectory(UPLOAD_DIRECTORY);
  await initializeDirectory(AVATARS_DIRECTORY);
  mongoose
    .set("strictQuery", false)
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("\nConnected to the database");
      console.log(new Date().toISOString());
      console.log("Listening on port 3000");
    })
});
