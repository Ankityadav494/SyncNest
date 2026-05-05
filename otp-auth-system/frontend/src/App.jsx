// ──────────────────────────────────────────────────────────────
// App.jsx – Main application component
// ──────────────────────────────────────────────────────────────
import { useState } from "react";
import EmailStep from "./components/EmailStep";
import OtpStep from "./components/OtpStep";
import SuccessScreen from "./components/SuccessScreen";

const STEPS = { EMAIL: 0, OTP: 1, SUCCESS: 2 };

function App() {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);

  /** Called after OTP is sent — move to verification step */
  const handleOtpSent = (submittedEmail) => {
    setEmail(submittedEmail);
    setStep(STEPS.OTP);
  };

  /** Called after OTP verified — move to success screen */
  const handleVerified = (data) => {
    setUserData(data);
    setStep(STEPS.SUCCESS);
  };

  /** Go back to email step */
  const handleBack = () => {
    setStep(STEPS.EMAIL);
  };

  /** Logout and reset everything */
  const handleLogout = () => {
    localStorage.removeItem("otp_auth_token");
    setEmail("");
    setUserData(null);
    setStep(STEPS.EMAIL);
  };

  return (
    <>
      {/* Animated background orbs */}
      <div className="bg-orbs">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      <div className="glass-card">
        {/* Step indicator dots */}
        <div className="steps">
          <div className={`step-dot ${step === STEPS.EMAIL ? "active" : step > STEPS.EMAIL ? "done" : ""}`} />
          <div className={`step-dot ${step === STEPS.OTP ? "active" : step > STEPS.OTP ? "done" : ""}`} />
          <div className={`step-dot ${step === STEPS.SUCCESS ? "active" : ""}`} />
        </div>

        {step === STEPS.EMAIL && <EmailStep onOtpSent={handleOtpSent} />}
        {step === STEPS.OTP && (
          <OtpStep email={email} onVerified={handleVerified} onBack={handleBack} />
        )}
        {step === STEPS.SUCCESS && (
          <SuccessScreen user={userData} onLogout={handleLogout} />
        )}
      </div>
    </>
  );
}

export default App;
