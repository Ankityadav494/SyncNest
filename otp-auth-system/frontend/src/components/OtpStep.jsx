// ──────────────────────────────────────────────────────────────
// components/OtpStep.jsx – 6-digit OTP verification step
// ──────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function OtpStep({ email, onVerified, onBack }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // ─── Countdown Timer ──────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ─── Handle individual digit input ────────────────────────
  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError("");

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (newDigits.every((d) => d !== "") && value) {
      setTimeout(() => verifyOtp(newDigits.join("")), 100);
    }
  };

  // ─── Handle backspace navigation ──────────────────────────
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ─── Handle paste (fill all boxes at once) ────────────────
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (pasted.length === OTP_LENGTH) {
      const newDigits = pasted.split("");
      setDigits(newDigits);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      setTimeout(() => verifyOtp(pasted), 100);
    }
  };

  // ─── Verify OTP API call ──────────────────────────────────
  const verifyOtp = async (otpString) => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp: otpString,
      });

      if (res.data.success) {
        // Store JWT token
        localStorage.setItem("otp_auth_token", res.data.token);
        onVerified(res.data.user);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Verification failed. Please try again.";
      setError(msg);
      // Clear digits on error
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────
  const handleResend = async () => {
    setError("");
    setSuccess("");
    setCanResend(false);
    setTimer(RESEND_COOLDOWN);
    setDigits(Array(OTP_LENGTH).fill(""));

    try {
      const res = await axios.post(`${API_URL}/send-otp`, { email });

      if (res.data.success) {
        setSuccess("A new OTP has been sent to your email.");
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP.";
      setError(msg);
    }
  };

  // Format timer display
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="auth-header">
        <div className="auth-logo">🔑</div>
        <h1>Enter Verification Code</h1>
        <p>
          We sent a 6-digit code to <br />
          <strong style={{ color: "var(--primary-400)" }}>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✅</span> {success}
        </div>
      )}

      <div className="form-group">
        <div className="otp-input-group" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-digit ${digit ? "filled" : ""}`}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      <button
        className="btn btn-primary"
        disabled={loading || digits.some((d) => !d)}
        onClick={() => verifyOtp(digits.join(""))}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Verifying...
          </>
        ) : (
          "Verify OTP ✓"
        )}
      </button>

      {/* Timer & Resend */}
      <div className="timer">
        {canResend ? (
          <span>
            Didn't receive the code?{" "}
            <button className="text-link" onClick={handleResend}>
              Resend OTP
            </button>
          </span>
        ) : (
          <span>
            Resend OTP in <span className="time">{formatTime(timer)}</span>
          </span>
        )}
      </div>

      {/* Back button */}
      <div className="form-footer">
        <button className="text-link" onClick={onBack}>
          ← Use a different email
        </button>
      </div>
    </>
  );
}
