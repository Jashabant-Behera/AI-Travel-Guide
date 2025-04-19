"use client";
import { useState, useEffect } from "react";
import ItineraryCard from "./ItineraryCard";
import "../styles/SavedItineraries.css";

const SavedItineraries = () => {
  const [loading, setLoading] = useState(true);
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
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      setItineraries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (id) => {
    // Handle editing the itinerary (e.g., redirect to edit page)
    console.log("Edit itinerary with id:", id);
  };

  useEffect(() => {
    const savedItineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    if (Array.isArray(savedItineraries)) {
      setItineraries(savedItineraries);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (itineraries.length > 0) {
      localStorage.setItem("itineraries", JSON.stringify(itineraries));
    }
  }, [itineraries]);
  if (loading) return <p>Loading itineraries...</p>;

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
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItineraries;
