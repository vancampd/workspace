const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');

router
    .route('/')
    .get((req, res) => {
        console.log("Ratings get request:", req)
        res.json({ 'message': 'get requests received for ratings by listingID'})
    })
    .post((req, res) => {
        console.log("Ratings post request:", req)
        res.json({ 'message': 'post requests received for ratings by listingID'})
    })