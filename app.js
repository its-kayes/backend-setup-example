import express from "express";
import helmet from "helmet";
import logger from "morgan";
import mongoose from "mongoose";
import cors from "cors";

import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import { MONGO_URI, PORT } from "./config/siteEnv.js";
import AppRoutes from "./AppRoutes.js";

// uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

const app = express();

// middleware
const options = [
  cors({
    origin: "*",
  }),
  logger("tiny"),
  helmet(),
  express.json({ limit: "30mb" }),
];
app.use(options);

app.use("/api/v1/", AppRoutes);

// routes
app.use("/health-check", (req, res) =>
  res.json({
    status: "success",
    message: "Server is running!",
  })
);

app.all("*", (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);

// server connect
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("dbConnection:", true);
    app.listen(PORT, () => console.log(`PORT: ${PORT}, serverRunning:`, true));
  });

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  app.close(() => process.exit(1));
});
