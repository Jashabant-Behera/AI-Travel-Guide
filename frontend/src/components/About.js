"use client";
import React, { useState, useEffect } from "react";
import "../styles/about.css";
import Image from "next/image";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  return (
    <section
      id="about"
      className={`about-section ${isVisible ? "fade-in" : ""}`}
      aria-labelledby="about-heading"
    >
      <Image className="image" src={"/background8.jpg"} alt="image" width={500} height={500} />
      <article className="about-container">
        <h2 id="about-heading" className="about-heading">
          About Us
        </h2>
        <p className="about-description">
          Welcome to <strong>AI Travel Buddy</strong> — your smart companion for discovering hidden
          gems, cultural experiences, and planning personalized itineraries around the world.
        </p>
        <p className="about-subtext">
          Powered by cutting-edge AI, our platform helps you uncover the best places, get instant
          recommendations, and create memorable journeys effortlessly.
        </p>
      </article>
    </section>
  );
};

export default About;
