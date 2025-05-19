import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/utils/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "../../styles/SharedItinerary.css";

const SharedItinerary = () => {
  const router = useRouter();
  const { token } = router.query;
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchSharedItinerary = async () => {
        try {
          const { data } = await api.get(`/api/itinerary/share/${token}`);
          setItinerary(data.itinerary);
        } catch (error) {
          toast.error("Failed to fetch shared itinerary");
          console.error(error);
          router.push("/"); // Redirect to home or another appropriate page
        } finally {
          setLoading(false);
        }
      };
      fetchSharedItinerary();
    }
  }, [token, router]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!itinerary) return <div>Itinerary not found</div>;

  return (
    <div className="shared-itinerary-container">
      <h1>{itinerary.location} Itinerary</h1>
      <p className="days-info">{itinerary.days} day{itinerary.days !== 1 ? 's' : ''}</p>
      <div className="itinerary-content">
        <ReactMarkdown>{itinerary.details}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SharedItinerary;
