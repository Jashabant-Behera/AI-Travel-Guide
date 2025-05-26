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
  const [showExportOptions, setShowExportOptions] = useState(null);

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

  useEffect(() => {
    if (id) {
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
        }
      };
      fetchItinerary();
    }
  }, [id, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateItinerary = () => {
    return formData.location.trim() && formData.preferences.trim() && formData.days > 0;
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
      toast.warning("Please fill all fields properly");
      return;
    }

    setCreating(true);
    try {
      const itineraryData = {
        location: formData.location.trim(),
        preferences: formData.preferences.split(",").map((pref) => pref.trim()),
        days: parseInt(formData.days, 10),
      };

      const { data } = await api.post("/api/itinerary/create", itineraryData);
      setItineraries((prev) => [data.itinerary, ...prev]);
      toast.success("Itinerary created successfully");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create itinerary");
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

  const truncateText = (text, wordCount) => {
    const words = text.split(" ");
    return words.length <= wordCount ? text : words.slice(0, wordCount).join(" ") + "...";
  };

  const handleViewDetails = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowModal(true);
  };

  const handleDownloadPDF = (id) => {
    const itinerary = itineraries.find((item) => item._id === id);
    if (!itinerary) return;

    fetch(`/api/itinerary/export/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `itinerary-${itinerary.location}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading the PDF:", error);
        toast.error("Failed to download the itinerary PDF");
      });
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
              <img
                src="/images/empty-travel.svg"
                alt="No itineraries"
                className="empty-illustration"
              />
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
                    <button className="text-link" onClick={() => handleViewDetails(itinerary)}>
                      ...more
                    </button>
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
                        {itinerary.isPublic ? "Private" : "Public"}
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
