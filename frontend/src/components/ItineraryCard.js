"use client";
import { useRouter } from "next/navigation";
import "../styles/itineraryCard.css";

const ItineraryCard = () => {
  const router = useRouter();

  return (
    <div className="itinerary-card">
      <h3 className="itinerary-title">title</h3>
      <p></p>
      <div className="itinerary-actions">
        <button className="itinerary-button view-button">View</button>
        <button className="itinerary-button edit-button">Edit</button>
        <button className="itinerary-button delete-button">Delete</button>
      </div>
    </div>
  );
};

export default ItineraryCard;
