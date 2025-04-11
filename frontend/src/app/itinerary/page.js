import ItineraryCard from "@/components/ItineraryCard";

export default function ItineraryPage() {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Your Itineraries</h2>
      <p className="mb-4">View, create, update or delete your travel plans.</p>
      <ItineraryCard />
    </div>
  );
}
