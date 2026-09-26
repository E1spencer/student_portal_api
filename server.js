import "dotenv/config";
import express from "express";

import connectDatabase from "./config/database.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

// Load environment variables

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

// Course routes
app.use("/api/courses", courseRoutes);

//404 ERROR HANDLER
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

//GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// Connect to MongoDB, then start server
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});