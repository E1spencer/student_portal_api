import express from "express";
import dotenv from "dotenv";

import connectDatabase from "./config/database.js";
import studentRoutes from "./routes/studentRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Student Portal API is running");
});

// Student routes
app.use("/api/students", studentRoutes);

// Connect to MongoDB, then start server
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});