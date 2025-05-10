"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import api from "@/utils/api";
import "../styles/verifyEmail.css";

const EmailVerify = () => {
  const router = useRouter();
  const { isLoggedin, userData, getUserData } = useContext(AppContext);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]);

  const startResendTimer = () => {
    setResendTimer(30);
    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOTP = async () => {
    try {
      const { data } = await api.post(`/api/auth/verifyOTP`);
      if (data.success) {
        toast.success(data.message);
        startResendTimer();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const OTPArray = inputRefs.current.map((input) => input.value);
    const OTP = OTPArray.join("");

    if (OTP.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const { data } = await api.post(`/api/auth/verifyAccount`, { OTP });

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        router.push("/profile");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
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
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");

    paste.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (userData && userData.isAccountVerified) {
      if (window.location.pathname !== "/profile") {
        router.push("/");
      }
    } else if (!isLoggedin) {
      router.push("/auth");
    }
  }, [isLoggedin, userData, router]);

  return (
    <div className="email-verify-container">
      <div className="email-verify-box">
        <div>
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            onClick={() => router.push("/")}
            className="cursor-pointer"
          />
        </div>

        <form onSubmit={onSubmitHandler}>
          <h1>Email Verification</h1>
          <p>Enter the 6-Digit Code sent to your email</p>

          <div className="verification-inputs" onPaste={handlePaste}>
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
                  className="otp-input"
                />
              ))}
          </div>

          <button type="submit" className="verify-button">
            Verify Email
          </button>
          <button
            onClick={() => {
              verifyOTP();
              startResendTimer();
            }}
            className={`verify-button ${resendTimer > 0 ? "disabled" : ""}`}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
