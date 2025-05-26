"use client";
import React, { useState, useEffect } from "react";
import "../styles/details.css";
import Image from "next/image";

const Details = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  return (
    <section
      id="details"
      className={`details-section ${isVisible ? "fade-in" : ""}`}
      aria-labelledby="details-heading"
    >
      <article className="details-container">
        <h2 id="details-heading" className="details-heading">
          Details
        </h2>
        <p className="details-description">
          Travel Buddy is designed to help you plan perfect trips, with real-time recommendations,
          itinerary building, cultural insights, and local food guides. The platform integrates AI
          and smart mapping to make travel planning easy, efficient, and exciting.
        </p>
      </article>

      <Image className="image" src={"/backdrop/background1.jpg"} alt="image" width={500} height={500} />
    </section>
  );
};

export default Details;
