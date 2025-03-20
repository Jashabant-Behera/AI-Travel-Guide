import Location from "../models/Location.js";

const createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json({ message: "Location Added Successfully", location });
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error });
  }
};

const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Error fetching location", error });
  }
};

const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location updated successfully", location });
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting location", error });
  }
};

const searchLocation = async (req, res) => {
 try{
      const {query} = req.query;

      if(!query){
      return res.status(400).json({error:"Seach query is required"});
      }
      const locations = await Location.find({

      $or: [
        { name: new RegExp(query, "i") },
        { country: new RegExp(query, "i") },
        { state: new RegExp(query, "i") },
        { city: new RegExp(query, "i") },
      ],
    });

    if (!locations.length) {
      return res.status(404).json({ message: "No matching locations found" });
    }

    res.json({ locations });

  } catch (error) {
    console.error("Error searching locations:", error);
    res.status(500).json({ error: "Server error during location search" });
  }
}

export {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  searchLocation
}