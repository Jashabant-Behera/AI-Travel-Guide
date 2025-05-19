"use client";

import React, { useContext, useState, useEffect } from "react";
import "../styles/Profile.css";
import Recommendations from "./Recommendations";
import SavedItineraries from "./Itineraries";
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
  faRightFromBracket,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContext);
  const router = useRouter();

  const [section, setSection] = useState("Your Account");
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
            <span className="title">Back to Home</span>
          </a>
        </div>

        <ul>
          {[
            { label: "Your Account", icon: faUser },
            { label: "Your Itinerary", icon: faSuitcaseRolling },
            { label: "Your Locations", icon: faMapLocationDot },
            { label: "AI Recommendations", icon: faRobot },
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