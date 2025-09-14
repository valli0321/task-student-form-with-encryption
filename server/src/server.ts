import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";
import app from "./app";


const PORT = process.env.PORT!;
const MONGO_URI: string = process.env.MONGODB_URI!;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
