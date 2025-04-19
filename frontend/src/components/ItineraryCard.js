"use client";
import { useRouter } from "next/navigation";
import "../styles/itineraryCard.css";

const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <div className="itinerary-card">
      <h3 className="itinerary-title">{itinerary.title}</h3>
      <p className="itinerary-description">{itinerary.description}</p>
      <div className="itinerary-actions">
        <button
          className="itinerary-button view-button"
          onClick={() => router.push(`/itinerary/${itinerary.id}`)}
        >
          View
        </button>
        <button className="itinerary-button edit-button" onClick={() => onEdit(itinerary.id)}>
          Edit
        </button>
        <button className="itinerary-button delete-button" onClick={() => onDelete(itinerary.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItineraryCard;
