"use client";
import { useState } from "react";
import ItineraryCard from "./ItineraryCard";
import "../styles/savedLocation.css";

const SavedItineraries = () => {
  const [itineraries, setItineraries] = useState([
    {
      id: "1",
      title: "Bali Adventure",
      description: "A week-long journey exploring beaches, temples, and volcanoes.",
    },
    {
      id: "2",
      title: "European Getaway",
      description: "10 days across Paris, Rome, and Amsterdam.",
    },
    {
      id: "3",
      title: "South India Tour",
      description: "Exploring Kerala backwaters, Tamil temples & spices.",
    },
  ]);

  const handleDelete = (id) => {
    setItineraries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="saved-itineraries-container">
      <h2 className="saved-itineraries-heading">Your Saved Itineraries</h2>
      {itineraries.length === 0 ? (
        <p className="saved-itineraries-empty-text">No itineraries saved yet.</p>
      ) : (
        <div className="saved-itineraries-grid">
          {itineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItineraries;
