import { app } from "./app.js";
import mongoose from "mongoose";


app.listen(3000, () => {
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
