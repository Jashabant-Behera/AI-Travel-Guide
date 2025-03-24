"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import "../styles/verifyEmail.css";

const VerifyEmail = ({ onVerify, onResend }) => {
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = () => {
    if (canResend) {
      onResend();
      toast.success("Verification link resent!");
      setResendTimer(30);
      setCanResend(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Verify Your Email</h2>
        <p className="verify-text">
          We’ve sent a verification link to your email. Please check your inbox and click the link to verify.
        </p>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`verify-button ${!canResend ? "disabled" : ""}`}
        >
          {canResend ? "Resend Verification Email" : `Resend in ${resendTimer}s`}
        </button>
        <button
          onClick={onVerify}
          className="verify-outline-button"
        >
          I have verified
        </button>
        <Link href="/auth?mode=login" className="verify-back-link">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
