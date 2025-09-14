import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", studentRoutes);

export default app;
