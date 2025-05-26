"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/utils/api";
import Image from "next/image";
import "../styles/resetPassword.css";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const [OTPSubmit, setOTPSubmit] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const inputRefs = useRef([]);

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/auth/resetOTP`, {
        email,
      });

      if (data.success) {
        toast.success(data.message);
        setEmailSent(true);
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const OTPArray = inputRefs.current.map((el) => el.value);
    const enteredOTP = OTPArray.join("");

    setOTP(enteredOTP);
    setOTPSubmit(true);
  };

  const handleInput = (e, index) => {
    if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);

    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/auth/resetPassword`, {
        email,
        OTP,
        newPassword,
      });

      if (data.success) {
        setIsVerified(true);
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
        toast.success("Password reset successfully! Redirecting...");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  if (isVerified) {
    return (
      <div className="verification-success">
        <div className="success-content">
          <h2>Password Reset Successful!</h2>
          <p>Your password has been updated successfully. Enjoy your travels!</p>
          <Image
            src="/icons/success.png"
            alt="Success"
            width={100}
            height={100}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`reset-container ${
        !emailSent ? "email-stage" : OTPSubmit ? "password-stage" : "otp-stage"
      }`}
    >
      <div className="reset-box">
        <div className="logo-container">
          <Image
            onClick={() => router.push("/")}
            src="/icons/logo.png"
            alt="Logo"
            width={100}
            height={40}
            className="logo"
          />
        </div>

        {!emailSent && (
          <form onSubmit={onSubmitEmail}>
            <h1>Reset Password</h1>
            <p>Enter your registered email address</p>
            <div className="reset-input">
              <Image
                src="/icons/mail.png"
                alt="Mail Icon"
                width={20}
                height={20}
                className="mail"
              />
              <input
                type="email"
                placeholder="Email Id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        {!OTPSubmit && emailSent && (
          <form onSubmit={onSubmitOTP}>
            <h1>Verify OTP</h1>
            <p>Enter the 6-digit code sent to your email</p>
            <div className="otp-container" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    required
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    pattern="\d*"
                    inputMode="numeric"
                  />
                ))}
            </div>
            <button type="submit">Verify</button>
          </form>
        )}

        {OTPSubmit && (
          <form onSubmit={onSubmitNewPassword}>
            <h1>Set New Password</h1>
            <p>Enter your new password</p>
            <div className="reset-input">
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;