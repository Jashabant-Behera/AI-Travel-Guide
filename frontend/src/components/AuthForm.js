"use client";

import React, { useContext, useState, useEffect } from "react";
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmithandler = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (state === "Sign Up") {
        res = await api.post("/api/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        res = await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      }

      const { data } = res;

      if (data.success) {
        toast.success(data.message);

        if (data.token) {
          localStorage.setItem("token", data.token);
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        }

        const safeUserData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          isVerified: data.user.isAccountVerified,
        };
        localStorage.setItem("user", JSON.stringify(safeUserData));

        console.log("token:", data.token);
        console.log("user Data", safeUserData)

        setIsLoggedin(true);
        setUserData(safeUserData);

        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className={`auth-container ${state === "Sign Up" ? "signup-bg" : "login-bg"}`}>
      <div className="auth-box">
        <div>
          <Image
            onClick={() => router.push("/")}
            src="/logo.png"
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
              <Image src="/people.png" alt="People" width={20} height={20} />
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
            <Image src="/mail.png" alt="Mail" width={20} height={20} />
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
            <Image src="/lock.png" alt="Lock" width={20} height={20} />
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
