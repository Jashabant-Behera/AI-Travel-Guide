"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "../styles/Itineraries.css";

const Itineraries = () => {
  const { id } = useParams();
  const router = useRouter();
  const [itineraries, setItineraries] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [formData, setFormData] = useState({
    location: "",
    preferences: "",
    days: 3,
  });
  const [creating, setCreating] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItineraries();
  }, []);

  useEffect(() => {
    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/itinerary/");
      
      if (data.success) {
        setItineraries(data.itineraries || []);
      }
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      // Error toast is handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerary = async () => {
    try {
      const { data } = await api.get(`/api/itinerary/${id}`);
      
      if (data.success) {
        setItinerary(data.itinerary);
        setIsPublic(data.itinerary.isPublic);
        if (data.itinerary.shareToken) {
          setShareLink(`${window.location.origin}/api/itinerary/share/${data.itinerary.shareToken}`);
        }
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      router.push("/itineraries");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateItinerary = () => {
    if (!formData.location.trim()) {
      toast.error("Please enter a location");
      return false;
    }
    
    if (!formData.preferences.trim()) {
      toast.error("Please enter your preferences");
      return false;
    }
    
    if (formData.days < 1 || formData.days > 30) {
      toast.error("Days must be between 1 and 30");
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData({
      location: "",
      preferences: "",
      days: 3,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateItinerary()) {
      return;
    }

    setCreating(true);
    try {
      const itineraryData = {
        location: formData.location.trim(),
        preferences: formData.preferences.split(",").map((pref) => pref.trim()).filter(Boolean),
        days: parseInt(formData.days, 10),
      };

      const { data } = await api.post("/api/itinerary/create", itineraryData);
      
      if (data.success) {
        setItineraries((prev) => [data.itinerary, ...prev]);
        toast.success("Itinerary created successfully");
        resetForm();
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
      // Error toast is handled by api interceptor
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    try {
      const { data } = await api.delete(`/api/itinerary/${id}`);
      
      if (data.success) {
        setItineraries((prev) => prev.filter((item) => item._id !== id));
        toast.success("Itinerary deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      // Error toast is handled by api interceptor
    }
  };

  const handleTogglePublic = async (id) => {
    try {
      const { data } = await api.patch(`/api/itinerary/public/${id}`);
      
      if (data.success) {
        setItineraries((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, isPublic: data.itinerary.isPublic, shareToken: data.shareToken }
              : item
          )
        );
        toast.success(`Itinerary is now ${data.itinerary.isPublic ? "public" : "private"}`);
      }
    } catch (error) {
      console.error("Error updating itinerary:", error);
      // Error toast is handled by api interceptor
    }
  };

  const truncateText = (text, wordCount) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= wordCount ? text : words.slice(0, wordCount).join(" ") + "...";
  };

  const handleViewDetails = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowModal(true);
  };

  const handleDownloadPDF = async (id) => {
    const itinerary = itineraries.find((item) => item._id === id);
    if (!itinerary) {
      toast.error("Itinerary not found");
      return;
    }

    try {
      toast.info("Preparing your PDF...");
      
      const response = await api.get(`/api/itinerary/export/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `itinerary-${itinerary.location.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      toast.error("Failed to download the itinerary PDF");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your itineraries...</p>
      </div>
    );
  }

  return (
    <div className="itineraries-page">
      <header className="page-header">
        <h1>Travel Itineraries</h1>
        <p>Plan and manage your travel adventures</p>
      </header>

      <div className="content-grid">
        <section className="create-section">
          <div className="card create-card">
            <h2>Create New Itinerary</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="location">Destination</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Where are you going?"
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferences">Interests</label>
                <input
                  type="text"
                  id="preferences"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleInputChange}
                  placeholder="e.g., beaches, hiking, museums"
                  required
                  maxLength={200}
                />
                <span className="input-hint">Separate with commas</span>
              </div>

              <div className="form-group">
                <label htmlFor="days">Duration (days)</label>
                <input
                  type="number"
                  id="days"
                  name="days"
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button" disabled={creating}>
                  {creating ? (
                    <>
                      <span className="spinner"></span>
                      Creating...
                    </>
                  ) : (
                    "Create Itinerary"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="itineraries-section">
          <div className="section-header">
            <h2>Your Itineraries</h2>
            <span className="count-badge">{itineraries.length}</span>
          </div>

          {itineraries.length === 0 ? (
            <div className="empty-state">
              <h3>No itineraries yet</h3>
              <p>Create your first itinerary to get started</p>
            </div>
          ) : (
            <div className="itineraries-grid">
              {itineraries.map((itinerary) => (
                <div key={itinerary._id} className="itinerary-card">
                  <div className="card-header">
                    <h3>{itinerary.location}</h3>
                    <span className={`public-badge ${itinerary.isPublic ? "public" : "private"}`}>
                      {itinerary.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="days-info">
                    {itinerary.days} day{itinerary.days !== 1 ? "s" : ""}
                  </p>

                  <div className="itinerary-preview">
                    <ReactMarkdown>{truncateText(itinerary.details, 30)}</ReactMarkdown>
                    {itinerary.details && itinerary.details.split(" ").length > 30 && (
                      <button className="text-link" onClick={() => handleViewDetails(itinerary)}>
                        ...more
                      </button>
                    )}
                  </div>

                  <div className="card-actions">
                    <div className="action-group">
                      <button
                        className="action-btn export-btn"
                        onClick={() => handleDownloadPDF(itinerary._id)}
                      >
                        Download PDF
                      </button>
                    </div>

                    <div className="action-group">
                      <button
                        className="action-btn public-btn"
                        onClick={() => handleTogglePublic(itinerary._id)}
                      >
                        {itinerary.isPublic ? "Make Private" : "Make Public"}
                      </button>
                    </div>

                    <div className="action-group">
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(itinerary._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showModal && selectedItinerary && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2>{selectedItinerary.location} Itinerary</h2>
            <p className="days-info">
              {selectedItinerary.days} day{selectedItinerary.days !== 1 ? "s" : ""}
            </p>
            <div className="modal-body">
              <ReactMarkdown>{selectedItinerary.details}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itineraries;
