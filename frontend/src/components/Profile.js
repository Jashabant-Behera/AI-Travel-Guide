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
  faHouse,
  faUser,
  faSuitcaseRolling,
  faMapLocationDot,
  faRobot,
  faKey,
  faCheckCircle,
  faRightFromBracket,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContext);
  const router = useRouter();

  const [section, setSection] = useState("Account");
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
      case "Your Account":
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
      case "Your Locations":
        return (
          <div className="content">
            <p>Locations content goes here.</p>
          </div>
        );
      case "AI Recommendations":
        return (
          <div className="content">
            <Recommendations />
          </div>
        );
      case "Password":
        return (
          <div className="content security-section">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPasswordForm(!showPasswordForm);
              }}
            >
              Change Password
            </button>
            {showPasswordForm && <ResetPassword />}
          </div>
        );
      case "Verify Email":
        return (
          <div className="content security-section">
            {userData?.isVerified ? (
              <p>Your account is already verified.</p>
            ) : (
              <>
                <button
                  onClick={() => {
                    verifyOTP();
                    setShowVerifyForm(!showVerifyForm);
                  }}
                >
                  Verify Email
                </button>
                {showVerifyForm && <EmailVerify />}
              </>
            )}
          </div>
        );
      default:
        return (
          <div className="content">
            <UserInfo />
          </div>
        );
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
        <div className="home-nav" onClick={() => router.push("/")}>
          <a>
            <span className="icon">
              <FontAwesomeIcon icon={faHouse} />
            </span>
            <span className="title">Home</span>
          </a>
        </div>

        <ul>
          {[
            { label: "Your Account", icon: faUser },
            { label: "Your Itinerary", icon: faSuitcaseRolling },
            { label: "Your Locations", icon: faMapLocationDot },
            { label: "AI Recommendations", icon: faRobot },
            { label: "Password", icon: faKey },
            { label: "Verify Email", icon: faCheckCircle },
          ].map(({ label, icon }) => (
            <li
              key={label}
              className={`list ${section === label ? "active" : ""}`}
              onClick={() => setSection(label)}
            >
              <b></b>
              <b></b>
              <a>
                <span className="icon">
                  <FontAwesomeIcon icon={icon} />
                </span>
                <span className="title">{label}</span>
              </a>
            </li>
          ))}
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

      <div className={`content-overlay ${menuOpen ? "active" : ""}`} onClick={toggleMenu}></div>

      {renderSection()}
    </div>
  );
};

export default Profile;
