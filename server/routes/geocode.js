const router = require('express').Router();
const rateLimit = require('../middleware/rateLimit');

// The listings page geocodes searches for signed-out visitors, so this route stays public;
// the limit stops one client from spending the Google API key's quota.
const geocodeLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

const GOOGLE_GEOCODING_URL =
  process.env.GOOGLE_GEOCODING_URL ||
  'https://maps.googleapis.com/maps/api/geocode/json?address=';
const { GOOGLE_API_KEY } = process.env;

router.route('/').get(geocodeLimiter, async (req, res) => {
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
    const location = data.results?.[0]?.geometry?.location;

    if (!location) {
      return res.status(404).json({ message: 'No geocode result found' });
    }

    return res.json(location);
  } catch (error) {
    console.log('Error fetching geocode', error);
    return res.status(500).json({ message: 'Error fetching geocode' });
  }
});

router.geocodeLimiter = geocodeLimiter;

module.exports = router;
