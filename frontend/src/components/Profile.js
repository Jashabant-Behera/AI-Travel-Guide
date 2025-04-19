"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import "../styles/Profile.css";
import ResetPassword from "./ResetPassword";
import EmailVerify from "./VerifyEmail";
import Recommendations from "./Recommendations";
import SavedItineraries from "./SavedItineraries";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../utils/api";


const Profile = () => {
  const { userData, setUserData, setIsLoggedin, api } = useContext(AppContext);
  const router = useRouter();

  const [section, setSection] = useState("User info");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);

  const logout = async () => {
    try {
      const { data } = await api.post(`/api/auth/logout`);
      toast.success(data.message);
      if (data.success) {
        localStorage.removeItem("token");
        setIsLoggedin(false);
        setUserData(null);
        router.push("/");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const verifyOTP = async () => {
    try {
      const { data } = await api.post(`/api/auth/verifyOTP`);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderSection = () => {
    if (!userData) {
      return (
        <div className="loading-container">
          <p className="loading-text">Login to get your profile...</p>
        </div>
      );
    }

    switch (section) {
      case "User info":
        return (
          <div>
            <main className="profile-main">
              <div className="profile-header">
                <Image
                  src="/avatar.png"
                  alt="User avatar"
                  width={100}
                  height={100}
                  className="avatar"
                  priority
                />
                <div className="user-details">
                  <h3>{userData.name}</h3>
                  <p>{userData.location || "Unknown Location"}</p>
                </div>
              </div>
            </main>
            <form className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={userData.name} readOnly />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={userData.fullName || ""} readOnly />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={userData.email} readOnly />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="e.g. New York, USA" />
              </div>
            </form>
          </div>
        );

      case "Your Itinerary":
        return (
          <div>
            <SavedItineraries />
          </div>
        );

      case "AI Recommendations":
        return (
          <div>
            <Recommendations />
          </div>
        );

      case "Change Password":
        return (
          <div className="security-section">
            <button onClick={() => setShowPasswordForm(!showPasswordForm)}>
              {showPasswordForm ? "Cancel Password Change" : "Change Password"}
            </button>
            {showPasswordForm && <ResetPassword />}

            {!userData?.isAccountVerified && (
              <button
                onClick={() => {
                  verifyOTP();
                  setShowVerifyForm(!showVerifyForm);
                }}
              >
                {showVerifyForm ? "Cancel Email Verification" : "Verify Email"}
              </button>
            )}

            {showVerifyForm && !userData?.isAccountVerified && <EmailVerify />}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <nav>
          <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
          <ul>
            {["User info", "Your Itinerary", "AI Recommendations", "Change Password"].map((item) => (
              <li
                key={item}
                className={section === item ? "active" : ""}
                onClick={() => setSection(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={logout} className="logout-btn">
          Log out
        </button>
      </aside>

      {renderSection()}
    </div>
  );
};

export default Profile;