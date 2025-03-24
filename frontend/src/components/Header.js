"use client";
import Link from "next/link";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1>
          <Link href="/" className="logo">
            Travel Buddy <span className="emoji">🌍</span>
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
