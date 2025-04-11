"use client";
import React from "react";
import "../styles/docs.css";

const Docs = () => {
  return (
    <div id="docs" className="docs-container">
      <h1 className="docs-title">Documentation</h1>

      <section className="docs-section">
        <h2 className="docs-subheading">Getting Started</h2>
        <p className="docs-text">
          To start using the AI-Powered Travel Guide, sign up for an account and verify your email.
          Once verified, you can log in and access personalized travel recommendations, create
          itineraries, and chat with our AI assistant.
        </p>
      </section>

      <section className="docs-section">
        <h2 className="docs-subheading">Creating Itineraries</h2>
        <p className="docs-text">
          Navigate to the Itinerary page, click on 'Create Itinerary,' and fill in your desired
          locations and dates. You can modify or delete these itineraries at any time. Use the
          map-based search to discover nearby places.
        </p>
      </section>

      <section className="docs-section">
        <h2 className="docs-subheading">Using the Chatbot</h2>
        <p className="docs-text">
          Our AI chatbot can answer travel-related questions, suggest destinations, and help plan
          your trips. Simply go to the AI Chat page and start typing your queries.
        </p>
      </section>

      <section className="docs-section">
        <h2 className="docs-subheading">Saving and Sharing</h2>
        <p className="docs-text">
          You can save your favorite locations and itineraries to your profile. Share your
          itineraries publicly with friends or fellow travelers by using the 'Share' option.
        </p>
      </section>

      <section className="docs-section">
        <h2 className="docs-subheading">Admin Access</h2>
        <p className="docs-text">
          Admins have additional privileges to manage content, approve user suggestions, and monitor
          app performance through the admin dashboard.
        </p>
      </section>

      <section className="docs-section">
        <h2 className="docs-subheading">Need More Help?</h2>
        <p className="docs-text">
          For additional assistance or troubleshooting, please refer to our help center or contact
          support.
        </p>
      </section>
    </div>
  );
};

export default Docs;
