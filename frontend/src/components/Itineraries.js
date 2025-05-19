"use client";
import { useState, useEffect } from "react";
import ItineraryCard from "./ItineraryCard";
import api from "@/utils/api";
import { toast } from "react-toastify";
import "../styles/Itineraries.css";

const Itineraries = () => {
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState([]);
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState("");
  const [days, setDays] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data } = await api.get("/api/itinerary/");
        setItineraries(data);
      } catch (error) {
        toast.error("Failed to fetch itineraries");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newItineraryData = {
        location,
        preferences: preferences.split(",").map((pref) => pref.trim()),
        days: parseInt(days, 10),
      };

      if (!location || !preferences || !days || days <= 0) {
        toast.warning("Please fill all fields properly");
        return;
      }

      const { data } = await api.post("/api/itinerary/create", newItineraryData);
      setItineraries((prev) => [...prev, data.itinerary]);
      toast.success("Itinerary created successfully");

      // Reset form fields
      setLocation("");
      setPreferences("");
      setDays("");
    } catch (error) {
      toast.error("Failed to create itinerary");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        await api.delete(`/api/itinerary/${id}`);
        setItineraries((prev) => prev.filter((item) => item._id !== id));
        toast.success("Itinerary deleted successfully");
      } catch (error) {
        toast.error("Failed to delete itinerary");
        console.error(error);
      }
    }
  };

  const handleTogglePublic = async (id) => {
    try {
      const { data } = await api.patch(`/api/itinerary/public/${id}`);
      setItineraries((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isPublic: data.itinerary.isPublic, shareToken: data.shareToken }
            : item
        )
      );
      toast.success(`Itinerary is now ${data.itinerary.isPublic ? "public" : "private"}`);
    } catch (error) {
      toast.error("Failed to update itinerary status");
      console.error(error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="itineraries-container">
      <div className="itineraries-section">
        <h2>Your Saved Itineraries</h2>
        {itineraries.length === 0 ? (
          <p className="empty-message">No itineraries found.</p>
        ) : (
          <div className="itinerary-grid">
            {itineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary._id}
                itinerary={itinerary}
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
              />
            ))}
          </div>
        )}
      </div>

      <div className="create-itinerary-section">
        <h2>Create New Itinerary</h2>
        <form onSubmit={handleCreateItinerary}>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="preferences">Preferences (comma-separated):</label>
            <input
              type="text"
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="days">Number of Days:</label>
            <input
              type="number"
              id="days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="create-button" disabled={creating}>
            {creating ? "Creating..." : "Create Itinerary"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Itineraries;
