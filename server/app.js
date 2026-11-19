const express = require('express');
const cors = require('cors');
const listingsRoutes = require('./routes/listings');
const favoritesRoutes = require('./routes/favorites');
const usersRoutes = require('./routes/users');
const geocodeRoutes = require('./routes/geocode');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

app.use('/listings', listingsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/users', usersRoutes);
app.use('/geocode', geocodeRoutes);

module.exports = app;
