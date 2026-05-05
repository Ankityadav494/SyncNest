import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

// ── OTP digit boxes ─────────────────────────────────────────
const OtpInput = ({ otp, setOtp }) => {
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    digits.forEach((d, idx) => { next[idx] = d; });
    setOtp(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-11 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
            ${d ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-slate-50 text-slate-900"}
            focus:border-indigo-500 focus:bg-indigo-50`}
          style={{ height: "3.25rem" }}
        />
      ))}
    </div>
  );
};

// ── Register component ───────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [step, setStep] = useState(1); // 1 = details form, 2 = OTP
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 1 — send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      // Check if email already registered
      await API.post("/auth/send-otp", { email });
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP & create account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register-with-otp", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: code,
      });
      loginUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email: formData.email });
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(255,255,255,0.15)" />
              <path d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {step === 1 ? "Create an account" : "Verify your email"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1 ? "Join SRMHive and start collaborating" : `Enter the code sent to ${formData.email}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-7">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-indigo-600" : "bg-slate-200"}`} />
          ))}
        </div>

        {/* ── STEP 1: Details form ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text" name="name" placeholder="Your name"
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email" name="email" placeholder="you@srmist.edu.in"
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password" name="password" placeholder="Create a password (min. 6 chars)"
                value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Sending code..." : "Send Verification Code →"}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP entry ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-700 text-center">
              📧 Check <span className="font-bold">{formData.email}</span> for a 6-digit code
            </div>

            <OtpInput otp={otp} setOtp={setOtp} />

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit" disabled={loading || otp.join("").length < 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Verify & Create Account ✓"}
            </button>

            <div className="text-center text-sm text-slate-500 space-x-2">
              {countdown > 0 ? (
                <span>Resend in <span className="font-bold text-indigo-600">{countdown}s</span></span>
              ) : (
                <button type="button" onClick={handleResend} className="text-indigo-600 font-semibold hover:underline">
                  Resend code
                </button>
              )}
              <span>·</span>
              <button type="button" onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); }}
                className="text-slate-500 hover:text-slate-700 hover:underline">
                Change email
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;