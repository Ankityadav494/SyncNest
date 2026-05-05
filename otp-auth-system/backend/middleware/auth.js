// ──────────────────────────────────────────────────────────────
// middleware/auth.js – JWT authentication middleware
// ──────────────────────────────────────────────────────────────
const jwt = require("jsonwebtoken");

/**
 * Protects routes by verifying the JWT in the Authorization header.
 * Usage: router.get("/protected", verifyToken, handler)
 */
const verifyToken = (req, res, next) => {
  try {
    // Expect header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired. Please login again."
        : "Invalid token.";

    return res.status(401).json({ success: false, message });
  }
};

module.exports = verifyToken;
