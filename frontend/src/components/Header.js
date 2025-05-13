"use client";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>TRAVEL THE BEST <br/> IT'S A BIG WORLD, <br/> EXPLORE </h1>
      <form className="search-bar">
        <input type="text" placeholder="Search locations..." />
        <button type="submit" disabled>Search</button>
      </form>
    </header>
  );
};

export default Header;
