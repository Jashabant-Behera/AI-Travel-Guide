"use client";

import Link from "next/link";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="#about" className="nav-link">About</a>
      <a href="#details" className="nav-link">Details</a>
      <a href="#features" className="nav-link">Features</a>
      <a href="#docs" className="nav-link">Docs</a>
      <Link href="/profile" className="nav-link">
        Profile
      </Link>
    </nav>
  );
};

export default Navbar;
