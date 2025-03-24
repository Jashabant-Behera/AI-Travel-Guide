"use client";
import React from "react";
import "../styles/details.css";

const Details = () => {
  return (
    <section id="details" className="details-section">
      <div className="details-container">
        <h2 className="details-heading">Details</h2>
        <p className="details-description">
          Travel Buddy is designed to help you plan perfect trips, with real-time recommendations, 
          itinerary building, cultural insights, and local food guides.  
          The platform integrates AI and smart mapping to make travel planning easy, 
          efficient, and exciting.
        </p>
      </div>
    </section>
  );
};

export default Details;
