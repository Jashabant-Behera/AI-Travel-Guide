"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import RecommendationCard from "./RecommendationCard";
import { jsPDF } from "jspdf";
import { html2pdf } from "html2pdf.js";
import { useRef } from "react";
import "../styles/recommendations.css";

const Recommendations = () => {
  const recommendationRef = useRef();

  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!location || !preferences) {
      setLoading(true); // Start loading
      setRecommendation(null);
      toast.warning("Please fill in both fields.");
      return;
    }

    try {
      const { data } = await axios.post("/api/recommendations/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, preferences }),
        location,
        preferences: preferences.split(",").map((p) => p.trim()),
      });

      setRecommendation(data.recommendation);
      toast.success("AI Recommendation created!");
    } catch (error) {
      toast.error("Failed to generate recommendations.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // or get it from cookies if that's your auth flow
      if (!token) {
        alert("You're not logged in!");
        return;
      }

      const response = await fetch("/api/recommendations/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id, // you must have user info from context or props
          location,
          preferences,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Recommendation saved:", data.recommendation);
        alert("Recommendation saved to your profile!");
      } else {
        console.error("Save failed:", data);
        alert(data.error || "Something went wrong while saving.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving recommendation. Check console.");
    }
  };

  const handleDownloadPDF = () => {
    if (!recommendationRef.current) return;

    import("html2pdf.js").then((html2pdf) => {
      html2pdf
        .default()
        .set({
          margin: 0.5,
          filename: "AI_Recommendation.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(recommendationRef.current)
        .save();
    });
  };
  return (
    <div className="recommendation-page">
      <h2>✨ Let AI Guide Your Next Adventure</h2>
      <p>Tell us where you’re going and what you love — we'll whip up something special.</p>

      <div className="recommendation-form">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter preferences (comma separated)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
        <button onClick={handleGenerate}>Generate Recommendation</button>
      </div>

      {loading && (
        <div className="loading-message">
          <p>Please wait... AI is generating your custom adventure plan!</p>
        </div>
      )}

      {!loading && recommendation && (
        <div className="recommendation-output" ref={recommendationRef}>
          <RecommendationCard recommendation={recommendation} />
          <div className="recommendation-actions">
            <button onClick={handleDownloadPDF}>Download as PDF</button>
            <button onClick={handleSave}>Save to Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
