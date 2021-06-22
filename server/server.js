const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const listingsRoutes = require('./routes/listings');
const favoritesRoutes = require('./routes/favorites');
const usersRoutes = require('./routes/users');
const {PORT} = process.env || 5000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'))

app.use('/listings', listingsRoutes);

app.use('/favorites', favoritesRoutes);

app.use('/users', usersRoutes);

app.listen(PORT, () => console.log(`The server is running on port http://localhost:${PORT}`));