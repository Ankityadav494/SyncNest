// ──────────────────────────────────────────────────────────────
// server.js – Entry point for the OTP Auth Backend
// ──────────────────────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

// ─── Connect to MongoDB ──────────────────────────────────────
connectDB();

// ─── Global Middleware ───────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ─── Health-check Route ──────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "OTP Auth API is running 🚀" });
});

// ─── API Routes ──────────────────────────────────────────────
app.use("/api/auth", otpRoutes);

// ─── Global Error Handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
