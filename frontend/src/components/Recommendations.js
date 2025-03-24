import { useState } from "react";
import Link from "next/link";
import "../styles/authform.css";

const AuthForm = ({ type = "login", onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields!");
    onSubmit({ email, password });
  };

  return (
    <div className="authform-container">
      <div className="authform-card">
        <h2 className="authform-heading">
          {type === "signup" ? "Create an account" : "Login to your account"}
        </h2>
        <form onSubmit={handleSubmit} className="authform-form">
          <input
            type="email"
            placeholder="Email"
            className="authform-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="authform-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="authform-button">
            {type === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>
        {type === "login" && (
          <div className="authform-links">
            <Link href="/auth?mode=signup" className="authform-link">
              Don’t have an account? Sign up
            </Link>
            <Link href="/auth?mode=reset" className="authform-link">
              Forgot Password?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
