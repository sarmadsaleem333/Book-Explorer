import express from "express";
import cors from "cors";
import helmet from "helmet";

import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Book Explorer API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/books", bookRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong while fetching books.",
  });
});

export default app;
