"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "../styles/navbar.css";
import api from "@/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData, setUserData, setIsLoggedin } = useContext(AppContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      toast.error(error.message);
      setIsLoggedin(false);
      setUserData(null);
      router.push("/");
    }
  };

  useEffect(() => {
    if (!userData) {
      router.push("/");
    }
  }, [userData, router]);

  return (
    <nav className="navbar">
      <div className="navContainer">
        <Link href="/" className="navlogo">
          <img src="/Rlogo.png" alt="Logo" className="navbarlogo" />
        </Link>

        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>

        <div className={`link ${isMenuOpen ? "active" : ""}`}>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#details" className="nav-link">
            Details
          </a>
          <a href="#testimonials" className="nav-link">
            Testimonials
          </a>
          <a href="#docs" className="nav-link">
            Docs
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <div className="profile">
            {userData ? (
              <div className="user-menu">
                <Image
                  src="/bagpack.png"
                  alt="User Icon"
                  className="bagpacklogo"
                  width={24}
                  height={24}
                />
                {userData.name.toUpperCase()}
                <div className="dropdown">
                  <ul className="dropdown-list">
                    <li onClick={() => router.push("/profile")} className="dropdown-item">
                    <FontAwesomeIcon icon={faUser} />
                      Dashboard
                    </li>
                    <li key="logout" onClick={logout} className="logout">
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link href="/auth" className="login-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
