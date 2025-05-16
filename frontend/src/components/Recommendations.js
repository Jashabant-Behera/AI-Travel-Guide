"use client";
import React, { useState, useRef } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import "../styles/recommendations.css";
import ReactMarkdown from "react-markdown";

const Recommendations = () => {
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const recommendationRef = useRef(null);

  const handleGenerate = async () => {
    if (!location || !preferences) {
      toast.warning("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      setRecommendation(null);

      const { data } = await api.post("/api/recommendations", {
        location,
        preferences: preferences.split(",").map((p) => p.trim()),
      });

      setRecommendation(data.recommendation);
    } catch (error) {
      toast.error("Failed to generate recommendations.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!recommendationRef.current) return;

    const element = recommendationRef.current.cloneNode(true);
    const buttons = element.querySelector(".download-btn-container");
    if (buttons) buttons.remove();

    import("html2pdf.js").then(({ default: html2pdf }) => {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `Travel_Recommendations_${location.replace(/\s+/g, '_')}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(element)
        .save();
    });
  };

  return (
    <div className="recommendation-page">
      <h2>✨ Travel Recommendations</h2>
      <p>Tell us where you're going and what you're interested in</p>

      <div className="recommendation-form">
        <input
          type="text"
          placeholder="Enter location (e.g., Paris, France)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Interests (comma separated, e.g., museums, food, hiking)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Get Recommendations"}
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          <p>✨ Finding the best recommendations for you...</p>
          <div className="loading-spinner"></div>
        </div>
      )}

      {!loading && recommendation && (
        <div className="recommendation-result">
          <div className="recommendation-output" ref={recommendationRef}>
            <div className="recommendation-card">
              <h3>Recommended for {location}</h3>
              <div className="description">
                <ReactMarkdown>
                  {recommendation.replace(/\*\*(.*?)\*\*/g, '**$1**')}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="download-btn-container">
            <button onClick={handleDownload} className="download-btn">
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;