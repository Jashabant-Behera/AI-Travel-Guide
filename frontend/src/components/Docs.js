"use client";
import React from "react";
import "../styles/docs.css";

const Docs = () => {
  return (
    <div id="docs" className="docs-container">
      <div className="docs-header">
        <h2 className="docs-main-title">AI Travel Buddy Documentation</h2>
      </div>

      <div className="docs-grid">
        <section className="docs-card">
          <div className="docs-card-header">
            <h2 className="docs-card-title">Getting Started</h2>
          </div>
          <div className="docs-card-content">
            <p>
              To start using the AI-Powered Travel Guide, sign up for an account and verify your
              email. Once verified, you can log in and access personalized travel recommendations,
              create itineraries, and chat with our AI assistant.
            </p>
          </div>
        </section>

        <section className="docs-card">
          <div className="docs-card-header">
            <h2 className="docs-card-title">Creating Itineraries</h2>
          </div>
          <div className="docs-card-content">
            <p>
              Navigate to the Itinerary page, click on 'Create Itinerary,' and fill in your desired
              locations and dates. You can modify or delete these itineraries at any time. Use the
              map-based search to discover nearby places.
            </p>
          </div>
        </section>

        <section className="docs-card">
          <div className="docs-card-header">
            <h2 className="docs-card-title">AI Travel Assistant</h2>
          </div>
          <div className="docs-card-content">
            <p>
              Answering travel-related questions, suggest destinations, and help plan your trips.
              Simply go to the AI Chat page and start typing your queries.
            </p>
          </div>
        </section>

        <section className="docs-card">
          <div className="docs-card-header">
            <h2 className="docs-card-title">Sharing Information</h2>
          </div>
          <div className="docs-card-content">
            <p>
              You can save your favorite locations and itineraries to your profile. Share your
              itineraries publicly with friends or fellow travelers by using the 'Share' option.
            </p>
          </div>
        </section>

        <section className="docs-card">
          <div className="docs-card-header">
            <h2 className="docs-card-title">Admin Features</h2>
          </div>
          <div className="docs-card-content">
            <div className="docs-admin-feature">
              <h3>Content Management</h3>
              <ul>
                <li>Approve user suggestions</li>
                <li>Curate featured destinations</li>
              </ul>
            </div>
            <div className="docs-admin-feature">
              <h3>Analytics Dashboard</h3>
              <ul>
                <li>User activity reports</li>
                <li>Popular destination trends</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="docs-card">
          <div className="docs-card-header">
            <h2 className="docs-card-title">Help & Support</h2>
          </div>
          <div className="docs-card-content">
            <div className="docs-support-options">
              <a className="docs-support-option">
                <span>❓</span> FAQ Center
              </a>
              <a className="docs-support-option">
                <span>📧</span> Email Support
              </a>
              <a className="docs-support-option">
                <span>💬</span> Live Chat
              </a>
            </div>
            <div className="docs-feedback">
              <p>
                For additional assistance or troubleshooting, please refer to our help center or
                contact support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Docs;
