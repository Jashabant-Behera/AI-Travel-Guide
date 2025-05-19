

"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "../styles/ItineraryDetail.css";

const ItineraryDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const { data } = await api.get(`/api/itinerary/${id}`);
        setItinerary(data);
        setIsPublic(data.isPublic);
        if (data.shareToken) {
          setShareLink(`${window.location.origin}/api/itinerary/share/${data.shareToken}`);
        }
      } catch (error) {
        toast.error("Failed to fetch itinerary");
        console.error(error);
        router.push("/itineraries");
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id, router]);

  const handleTogglePublic = async () => {
    try {
      const { data } = await api.patch(`/api/itinerary/public/${id}`);
      setIsPublic(data.itinerary.isPublic);
      setShareLink(data.itinerary.isPublic 
        ? `${window.location.origin}/api/itinerary/share/${data.shareToken}`
        : ""
      );
      toast.success(`Itinerary is now ${data.itinerary.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      toast.error("Failed to update itinerary status");
      console.error(error);
    }
  };

  const handleExport = () => {
    window.open(`/api/itinerary/export/${id}`, '_blank');
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!itinerary) return <div>Itinerary not found</div>;

  return (
    <div className="itinerary-detail-container">
      <div className="itinerary-header">
        <h2>{itinerary.location} Itinerary</h2>
        <p>{itinerary.days} day{itinerary.days !== 1 ? 's' : ''}</p>
      </div>

      <div className="itinerary-actions">
        <button onClick={handleTogglePublic} className="public-btn">
          {isPublic ? 'Make Private' : 'Make Public'}
        </button>
        <button onClick={handleExport} className="export-btn">
          Export PDF
        </button>
      </div>

      {isPublic && shareLink && (
        <div className="share-section">
          <p>Share this itinerary:</p>
          <input 
            type="text" 
            value={shareLink} 
            readOnly 
            onClick={(e) => e.target.select()} 
          />
        </div>
      )}

      <div className="itinerary-content">
        <ReactMarkdown>{itinerary.details}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ItineraryDetail;