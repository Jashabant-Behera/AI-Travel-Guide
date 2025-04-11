"use client";

import { useState } from "react";
import Link from "next/link";
import "../styles/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navContainer">
        <Link href="/" className="navlogo">
          <img src="/logo.png" alt="Logo" className="navbarlogo" />
        </Link>

        <div className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          ☰
        </div>

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
          <Link href="/auth" className="nav-link">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
