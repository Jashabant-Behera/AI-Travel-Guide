"use client";
import { useState } from "react";
import "../styles/resetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    // TODO: Connect this to your API route for password reset
    setMessage(`Reset link sent to ${email}. (Pretend 😎)`);
    setEmail("");
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Reset Password</h2>
        <form onSubmit={handleReset}>
          <div className="reset-form-group">
            <label htmlFor="email" className="reset-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="reset-input"
              required
            />
          </div>
          {message && <p className="reset-message">{message}</p>}
          <button
            type="submit"
            className="reset-button"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
