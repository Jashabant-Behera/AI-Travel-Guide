import React from "react";
import "../styles/recommendationCard.css";
import ReactMarkdown from "react-markdown";

const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="recommendation-card">
      <h3>{recommendation.name}</h3>
      <p>
        <strong>Location:</strong> {recommendation.location}
      </p>
      <p>
        <strong>Category:</strong> {recommendation.category}
      </p>
      <div className="description">
        <ReactMarkdown>{recommendation.description}</ReactMarkdown>
      </div>
    </div>
  );
};

export default RecommendationCard;
