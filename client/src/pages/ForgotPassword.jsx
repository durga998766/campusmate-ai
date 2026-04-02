import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../utils/auth";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [recoveredPassword, setRecoveredPassword] = useState("");

  const handleReset = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const savedUser = getSavedUser(email);

    if (!savedUser) {
      alert("No account found with this email");
      return;
    }

    setRecoveredPassword(savedUser.password);
    setShowInfo(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-card auth-animate">
        <div className="auth-logo">CM</div>
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your email to recover your account in demo mode
        </p>

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="auth-btn" onClick={handleReset}>
          Recover Password
        </button>

        {showInfo && (
          <div className="recovery-box mt-3">
            <strong>Recovered Password:</strong> {recoveredPassword}
          </div>
        )}

        <p className="auth-bottom-text mt-4">
          Back to{" "}
          <button className="link-btn" onClick={() => navigate("/")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;