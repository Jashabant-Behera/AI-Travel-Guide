"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import "../styles/features.css";

const features = [
  {
    title: "AI-Powered Travel Assistant",
    description: "Get personalized recommendations and itinerary suggestions using AI.",
  },
  {
    title: "Interactive Maps & Routes",
    description: "Visualize locations and optimized travel routes for seamless planning.",
  },
  {
    title: "Itinerary Management",
    description: "Create, modify, and export travel itineraries with ease.",
  },
  {
    title: "Local Food & Culture Insights",
    description: "Discover hidden gems, local cuisine, and cultural hotspots.",
  },
  {
    title: "Publicly Shareable Itineraries",
    description: "Share your itineraries with friends and community with just a link.",
  },
  {
    title: "Image Recognition & NLP",
    description: "Upload images or text and let AI help identify places or extract info.",
  },
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      <h2 className="features-heading">Key Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <CheckCircle className="feature-icon" size={40} color="#00bcd4" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;