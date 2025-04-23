"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import RecommendationCard from "./RecommendationCard";
import "../styles/recommendations.css";

const Recommendations = ({ user }) => {
  const recommendationRef = useRef();
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [fetchingSaved, setFetchingSaved] = useState(false);

  useEffect(() => {
    const fetchSavedRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user?._id) return;

        setFetchingSaved(true);
        const response = await fetch(`/api/recommendations/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error("Error fetching saved recommendations:", error);
      } finally {
        setFetchingSaved(false);
      }
    };

    fetchSavedRecommendations();
  }, [user]);

  const handleGenerate = async () => {
    if (!location || !preferences) {
      toast.warning("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      setRecommendation(null);

      const { data } = await api.post("/api/recommendations/ai", {
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You're not logged in!");
        return;
      }

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          location,
          preferences,
          recommendation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSavedRecommendations((prev) => [data.recommendation, ...prev]);
        toast.success("Recommendation saved to your profile!");
      } else {
        console.error("Save failed:", data);
        toast.error(data.error || "Something went wrong while saving.");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving recommendation.");
    }
  };

  const handleDownloadPDF = () => {
    if (!recommendationRef.current) return;

    const element = recommendationRef.current.cloneNode(true);
    const buttons = element.querySelector(".recommendation-actions");
    if (buttons) buttons.style.display = "none";

    import("html2pdf.js").then(({ default: html2pdf }) => {
      html2pdf()
        .set({
          margin: 0.5,
          filename: "AI_Recommendation.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    });
  };

  return (
    <div className="recommendation-page">
      <h2>✨ Let AI Guide Your Next Adventure</h2>
      <p>Tell us where you're going and what you love — we'll whip up something special.</p>

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
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Recommendation"}
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          <p>✨ AI is crafting your perfect adventure...</p>
          <div className="loading-spinner"></div>
        </div>
      )}

      {!loading && recommendation && (
        <div className="recommendation-result">
          <div className="recommendation-output" ref={recommendationRef}>
            <RecommendationCard recommendation={recommendation} />
          </div>
          <div className="recommendation-actions">
            <button onClick={handleDownloadPDF}>Download as PDF</button>
            <button onClick={handleSave}>Save to Profile</button>
          </div>
        </div>
      )}

      {savedRecommendations.length > 0 && (
        <div className="saved-recommendations">
          <h3>Your Saved Recommendations</h3>
          {fetchingSaved ? (
            <p>Loading your recommendations...</p>
          ) : (
            <div className="recommendation-list">
              {savedRecommendations.map((rec, index) => (
                <RecommendationCard
                  recommendation={{
                    name: rec.name,
                    description: rec.description,
                    location: rec.location,
                    category: rec.category,
                  }}
                  isSaved
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
