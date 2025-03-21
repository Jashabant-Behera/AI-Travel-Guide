import Location from "../models/Location.js";

const createLocation = async (req, res) => {
  const { name, latitude, longitude } = req.body;
  if (!name || !latitude || !longitude) {
    return res.status(400).json({ message: "Name, latitude, and longitude are required." });
  }
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json({ message: "Location Added Successfully", location });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Error creating location", error });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Error fetching locations", error });
  }
};

const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    return res.json({ message: "Location fetched successfully", data: location });
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Error fetching location", error });
  }
};

const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location updated successfully", data: location });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Error updating location", error });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    return res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting location", error });
  }
};

const searchLocation = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return res.status(400).json({ message: "Search query cannot be empty." });
  }

  try {
    const locations = await Location.find({
      $or: [
        { name: new RegExp(trimmedQuery, "i") },
        { country: new RegExp(trimmedQuery, "i") },
        { state: new RegExp(trimmedQuery, "i") },
        { city: new RegExp(trimmedQuery, "i") },
      ],
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: "No matching locations found." });
    }

    res.status(200).json({ message: "Locations fetched successfully", data: locations });
  } catch (error) {
    console.error("Error searching locations:", error);
    res.status(500).json({ message: "Server error during location search", error: error.message });
  }
};

export {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  searchLocation
}