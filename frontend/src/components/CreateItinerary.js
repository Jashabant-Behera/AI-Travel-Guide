"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";
import "../styles/CreateItinerary.css";

const CreateItinerary = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    preferences: "",
    days: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "days" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.preferences) {
      toast.warning("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const preferencesArray = formData.preferences.split(",").map(p => p.trim());
      
      const { data } = await api.post("/api/itinerary/create", {
        location: formData.location,
        preferences: preferencesArray,
        days: formData.days,
      });

      toast.success("Itinerary created successfully!");
      router.push(`/itinerary/${data.itinerary._id}`);
    } catch (error) {
      toast.error("Failed to create itinerary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-itinerary-container">
      <h2>Create New Itinerary</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where are you going?"
            required
          />
        </div>

        <div className="form-group">
          <label>Interests (comma separated)</label>
          <input
            type="text"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            placeholder="e.g., beaches, hiking, museums"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Days</label>
          <select
            name="days"
            value={formData.days}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Generate Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default CreateItinerary;