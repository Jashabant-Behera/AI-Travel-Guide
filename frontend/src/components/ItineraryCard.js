"use client";
import { useRouter } from "next/navigation";
import "../styles/itineraryCard.css";

const ItineraryCard = ({ itinerary, onDelete }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/itinerary/${itinerary.id}`);
  };

  const handleEdit = () => {
    router.push(`/itinerary/edit/${itinerary.id}`);
  };

  const handleDelete = () => {
    if (confirm(`Delete itinerary: "${itinerary.title}"?`)) {
      onDelete(itinerary.id);
    }
  };

  return (
    <div className="itinerary-card">
      <h3 className="itinerary-title">{itinerary.title}</h3>
      <p className={itinerary.description ? "itinerary-description" : "itinerary-empty-description"}>
        {itinerary.description || "No description available."}
      </p>
      <div className="itinerary-actions">
        <button
          onClick={handleView}
          className="itinerary-button view-button"
        >
          View
        </button>
        <button
          onClick={handleEdit}
          className="itinerary-button edit-button"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="itinerary-button delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItineraryCard;
