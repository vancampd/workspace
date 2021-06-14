const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const listingsRoutes = require('./routes/listings');
// const commentsRoutes = require('./routes/comments');
// const ratingsRoutes = require('./routes/ratings');

const {PORT} = process.env || 5000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'))

// app.use('listings/:listingsID/comments', commentsRoutes);

// app.use('listings/:listingsID/ratings', ratingsRoutes);

app.use('/listings', listingsRoutes);

app.listen(PORT, () => console.log(`The server is running on port http://localhost:${PORT}`));