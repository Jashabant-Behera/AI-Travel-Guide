"use client";
import React from "react";
import "../styles/features.css";

const Features = () => {
  return (
    <section id="features" className="features-section">
      <h2 className="features-heading">Key Features</h2>

      <div className="features-grid">
        <div className="feature-card">
          <img src="/aiAssistant.png" alt="AI-Powered Travel Assistant" />
          <div className="feature-content">
            <h3 className="feature-title">AI-Powered Travel Assistant</h3>
            <p className="feature-description">
              Get personalized recommendations and itinerary suggestions using AI.
            </p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-content">
            <h3 className="feature-title">Interactive Maps & Routes</h3>
            <p className="feature-description">
              Visualize locations and optimized travel routes for seamless planning.
            </p>
          </div>
          <img src="/maps.png" alt="Interactive Maps & Routes" />
        </div>
        <div className="feature-card">
          <img src="/itinerary.png" alt="Itinerary Management" />
          <div className="feature-content">
            <h3 className="feature-title">Itinerary Management</h3>
            <p className="feature-description">
              Create, modify, and export travel itineraries with ease.
            </p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-content">
            <h3 className="feature-title">Local Food & Culture Insights</h3>
            <p className="feature-description">
              Discover hidden gems, local cuisine, and cultural hotspots.
            </p>
          </div>
          <img src="/heritage.png" alt="Local Food & Culture Insights" />
        </div>
        <div className="feature-card">
          <img src="/public.png" alt="Publicly Shareable Itineraries" />
          <div className="feature-content">
            <h3 className="feature-title">Publicly Shareable Itineraries</h3>
            <p className="feature-description">
              Share your itineraries with friends and community with just a link.
            </p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-content">
          <div className="feature-badge">Working on</div> 
            <h3 className="feature-title">Image Recognition & NLP</h3>
            <p className="feature-description">
              Upload images or text and let AI help identify places or extract info.
            </p>
          </div>
          <img src="/image-nlp.png" alt="Image Recognition & NLP" />
        </div>
      </div>
    </section>
  );
};

export default Features;
