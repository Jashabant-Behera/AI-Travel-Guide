"use client";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>EXPLORE YOUR DESTINATION</h1>
      <form className="search-bar">
        <input type="text" placeholder="Search locations..." />
        <button type="submit">Search</button>
      </form>
    </header>
  );
};

export default Header;
