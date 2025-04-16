"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import "../styles/authform.css";

const AuthForm = () => {
  const router = useRouter();
  const { backendURL, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmithandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendURL}/api/auth/signup`, {
          name,
          email,
          password,
        });
  
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          router.push("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/auth/login`, {
          email,
          password,
        });
  
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          router.push("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
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
            className="cursor-pointer"
          />
        </div>

        <h1>{state === "Sign Up" ? "Create Account" : "Login"}</h1>
        <p>{state === "Sign Up" ? "Create Your Account" : "Login to Your Account"}</p>

        <form onSubmit={onSubmithandler}>
          {state === "Sign Up" && (
            <div className="auth-input">
              <Image src="/people.png" alt="People" width={20} height={20} />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Id"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-input">
            <Image src="/lock.png" alt="Lock" width={20} height={20} />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
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
