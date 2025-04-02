"use client";

import Link from "next/link";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navContainer">
        <Link href="/" className="navlogo">
          <span className="emoji">🌍</span>
        </Link>
        <div className="link">
          <a href="#features" className="nav-link">Features</a>
          <a href="#details" className="nav-link">Details</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="#docs" className="nav-link">Docs</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <Link href="/auth" className="nav-link">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
