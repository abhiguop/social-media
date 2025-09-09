const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// using middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Load environment variables from project root .env
require("dotenv").config();

const post = require("./routes/post");
const user = require("./routes/user");

//importing routes
app.use("/api/v1", post);
app.use("/api/v1", user);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  const dbState = mongoose.connection?.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  const status = states[dbState] ?? "unknown";
  const isHealthy = dbState === 1;
  res.status(isHealthy ? 200 : 503).json({
    service: "backend",
    uptime: process.uptime(),
    db: {
      state: dbState,
      status
    }
  });
});

module.exports = app;