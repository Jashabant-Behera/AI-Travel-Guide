"use client";
import { useRouter } from "next/navigation";
import "../styles/itineraryCard.css";

const ItineraryCard = ({ itinerary, onDelete, onTogglePublic }) => {
  const router = useRouter();

  return (
    <div className="itinerary-card">
      <div className="card-header">
        <h3>{itinerary.location}</h3>
        <span className={`public-badge ${itinerary.isPublic ? 'public' : 'private'}`}>
          {itinerary.isPublic ? 'Public' : 'Private'}
        </span>
      </div>
      <p className="days-info">{itinerary.days} day{itinerary.days !== 1 ? 's' : ''}</p>
      <div className="card-actions">
        <button 
          className="action-btn view-btn"
          onClick={() => router.push(`/itinerary/${itinerary._id}`)}
        >
          View Details
        </button>
        <button 
          className="action-btn export-btn"
          onClick={() => window.open(`/api/itinerary/export/${itinerary._id}`, '_blank')}
        >
          Export PDF
        </button>
        <button 
          className="action-btn public-btn"
          onClick={() => onTogglePublic(itinerary._id)}
        >
          {itinerary.isPublic ? 'Make Private' : 'Make Public'}
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(itinerary._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItineraryCard;