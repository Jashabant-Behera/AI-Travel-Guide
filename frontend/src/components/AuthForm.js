"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Image from "next/image";
import "../styles/authform.css";
import api from "@/utils/api";

const AuthForm = () => {
  const router = useRouter();
  const { setIsLoggedin, setUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmithandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = state === "Sign Up" ? "/api/auth/signup" : "/api/auth/login";
      const payload =
        state === "Sign Up"
          ? { name: formData.name, email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password };

      const { data } = await api.post(endpoint, payload);

      if (!data?.success) {
        throw new Error(data?.message || "Authentication failed");
      }

      toast.success(data.message);

      if (data.success) {
        toast.success(data.message);

        if (data.token) {
          localStorage.setItem("token", data.token);
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        }

        const safeUserData = {
          id: data.user?.id || data.user?._id || "",
          name: data.user?.name || "",
          email: data.user?.email || formData.email,
          isVerified: data.user?.isAccountVerified || false,
        };

        localStorage.setItem("user", JSON.stringify(safeUserData));
        setIsLoggedin(true);
        setUserData(safeUserData);

        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${state === "Sign Up" ? "signup-bg" : "login-bg"}`}>
      <div className="auth-box">
        <div>
          <Image
            onClick={() => router.push("/")}
            src="/icons/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="logo"
          />
        </div>

        <h1>{state === "Sign Up" ? "Create Account" : "Login"}</h1>
        <p>{state === "Sign Up" ? "Create Your Account" : "Login to Your Account"}</p>

        <form onSubmit={onSubmithandler} method="POST">
          {state === "Sign Up" && (
            <div className="auth-input">
              <Image src="/icons/people.png" alt="People" width={20} height={20} />
              <input
                onChange={handleInputChange}
                value={formData.name}
                name="name"
                type="text"
                placeholder="Full Name"
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-input">
            <Image src="/icons/mail.png" alt="Mail" width={20} height={20} />
            <input
              onChange={handleInputChange}
              value={formData.email}
              name="email"
              type="email"
              placeholder="Email Id"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-input">
            <Image src="/icons/lock.png" alt="Lock" width={20} height={20} />
            <input
              onChange={handleInputChange}
              value={formData.password}
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete={state === "Sign Up" ? "new-password" : "current-password"}
            />
          </div>

          <button type="submit">{state}</button>
          <span onClick={() => router.push("/reset")}>Forgot Password?</span>
        </form>

        {state === "Sign Up" ? (
          <p>
            Already have an account? <span onClick={() => setState("Login")}>Login Here</span>
          </p>
        ) : (
          <p>
            Don't have an account? <span onClick={() => setState("Sign Up")}>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
