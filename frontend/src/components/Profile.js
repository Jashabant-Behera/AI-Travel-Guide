"use client";

import React, { useContext, useState, useEffect } from "react";

import "../styles/Profile.css";
import ResetPassword from "./ResetPassword";
import EmailVerify from "./VerifyEmail";
import Recommendations from "./Recommendations";
import SavedItineraries from "./SavedItineraries";
import UserInfo from "./UserInfo";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faSuitcaseRolling,
  faGear,
  faRightFromBracket,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";


const Profile = () => {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContext);
  const router = useRouter();

  const [section, setSection] = useState("User info");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const renderSection = () => {
    if (!userData) {
      return (
        <div className="loading-container">
          <p className="loading-text">Fetching your profile...</p>
        </div>
      );
    }

    switch (section) {
      case "User info":
        return (
          <div className="content">
            <UserInfo />
          </div>
        );

      case "Your Itinerary":
        return (
          <div className="content">
            <SavedItineraries />
          </div>
        );

      case "Trip Suggestions":
        return (
          <div className="content">
            <Recommendations />
          </div>
        );

      case "Settings":
        return (
          <div className="content security-section">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPasswordForm(!showPasswordForm);
              }}
            >
              {showPasswordForm ? "Cancel Password Change" : "Change Password"}
            </button>
            {showPasswordForm && <ResetPassword />}

            {userData?.isVerified ? (
              <p>Your account is already verified.</p>
            ) : (
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

  useEffect(() => {
    if (!userData) {
      const timer = setTimeout(() => {
        router.push("/auth");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-wrapper">
      <div className="toogle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="toggle-icon" />
      </div>

      <div className={`navigation ${menuOpen ? "responsive" : ""}`}>
        <ul>
          {["User info", "Your Itinerary", "Trip Suggestions", "Settings"].map((item, index) => {
            const iconMap = [faHome, faUser, faSuitcaseRolling, faGear];

            return (
              <li
                key={item}
                className={`list ${section === item ? "active" : ""}`}
                onClick={() => setSection(item)}
              >
                <b></b>
                <b></b>
                <a>
                  <span className="icon">
                    <FontAwesomeIcon icon={iconMap[index]} />
                  </span>
                  <span className="title">{item}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="sign-out-container">
          <li className="list sign-out" onClick={logout}>
            <a>
              <span className="icon">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              <span className="title">Sign Out</span>
            </a>
          </li>
        </div>
      </div>

      {renderSection()}
    </div>
  );
};

export default Profile;
