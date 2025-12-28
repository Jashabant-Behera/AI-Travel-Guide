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

  const validateInput = () => {
    if (!location.trim()) {
      toast.warning("Please enter a location");
      return false;
    }
    
    if (!preferences.trim()) {
      toast.warning("Please enter your preferences");
      return false;
    }
    
    return true;
  };

  const handleGenerate = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      setRecommendation(null);

      const preferencesArray = preferences
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      if (preferencesArray.length === 0) {
        toast.warning("Please enter at least one preference");
        setLoading(false);
        return;
      }

      const { data } = await api.post("/api/recommendations", {
        location: location.trim(),
        preferences: preferencesArray,
      });

      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
        toast.success("Recommendations generated successfully!");
      } else {
        toast.error("Failed to generate recommendations");
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      // Error toast is handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!recommendationRef.current) {
      toast.error("No recommendation to download");
      return;
    }

    try {
      toast.info("Preparing your PDF...");
      
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
          .save()
          .then(() => {
            toast.success("PDF downloaded successfully!");
          })
          .catch((error) => {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF");
          });
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download recommendations");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
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
          onKeyPress={handleKeyPress}
          maxLength={100}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Interests (comma separated, e.g., museums, food, hiking)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={200}
          disabled={loading}
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading || !location.trim() || !preferences.trim()}
        >
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