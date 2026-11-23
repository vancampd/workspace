const router = require('express').Router();

const GOOGLE_GEOCODING_URL =
  process.env.GOOGLE_GEOCODING_URL ||
  'https://maps.googleapis.com/maps/api/geocode/json?address=';
const { GOOGLE_API_KEY } = process.env;

router.route('/').get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ message: 'Google API key is not configured' });
  }

  try {
    const response = await fetch(
      `${GOOGLE_GEOCODING_URL}${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    const result = data.results?.[0];

    if (data.status === 'ZERO_RESULTS' || !result?.geometry?.location) {
      if (data.status && !['OK', 'ZERO_RESULTS'].includes(data.status)) {
        console.log('Geocoding provider error', data.status, data.error_message);
        return res.status(502).json({ message: 'Geocoding service error' });
      }

      return res.status(404).json({ message: 'No geocode result found' });
    }

    return res.json({
      ...result.geometry.location,
      formattedAddress: result.formatted_address,
      partialMatch: Boolean(result.partial_match),
    });
  } catch (error) {
    console.log('Error fetching geocode', error);
    return res.status(500).json({ message: 'Error fetching geocode' });
  }
});

module.exports = router;
