import Location from '../models/Location.js';

const searchNearby = async (req, res) => {
  try {
    const { lat, long, radius } = req.query;
    if (!lat || !long || !radius) {
      return res.status(400).json({ message: 'Latitude, longitude, and radius are required.' });
    }

    const locations = await Location.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(long), parseFloat(lat)], parseFloat(radius) / 6378.1] // convert km to radians
        }
      }
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error in searchNearby:', error);
    res.status(500).json({ message: 'Server error.' });
  }
}

export default searchNearby;