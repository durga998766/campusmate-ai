import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../utils/auth";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const result = signupUser({ name, email, password });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Account created successfully.");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-card auth-animate">
        <div className="auth-logo">CM</div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Start your smart preparation journey with CampusMate AI
        </p>

        <input
          className="form-control mb-3"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrap mb-3">
          <input
            className="form-control password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="auth-btn" onClick={handleSignup}>
          Sign Up
        </button>

        <p className="auth-bottom-text mt-4">
          Already have an account?{" "}
          <button className="link-btn" onClick={() => navigate("/")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;