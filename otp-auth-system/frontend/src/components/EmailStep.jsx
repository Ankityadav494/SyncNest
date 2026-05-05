// ──────────────────────────────────────────────────────────────
// components/EmailStep.jsx – Email input & Send OTP step
// ──────────────────────────────────────────────────────────────
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export default function EmailStep({ onOtpSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/send-otp`, {
        email: email.trim().toLowerCase(),
      });

      if (res.data.success) {
        onOtpSent(email.trim().toLowerCase());
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <div className="auth-logo">🔐</div>
        <h1>Welcome Back</h1>
        <p>Enter your email to receive a one-time verification code</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
              disabled={loading}
            />
            <span className="icon">✉️</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              Sending OTP...
            </>
          ) : (
            "Send OTP →"
          )}
        </button>
      </form>

      <div className="form-footer">
        We'll send a 6-digit code to your inbox
      </div>
    </>
  );
}
