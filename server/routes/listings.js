const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');

router
    .route('/')
    .get((req, res) => {
        console.log("Listings get request:", req)
        res.json({ 'message': 'get requests received for listings'})
    })
    .post((req, res) => {
        console.log("Listings post request:", req)
        res.json({ 'message': 'post requests received for listings'})
    })

router
    .route('/:listingID')
    .get((req, res) => {
        console.log("Listings by id get request:", req)
        res.json({ 'message': 'get requests received for listings by id'})
    })
    .post((req, res) => {
        console.log("Listings by id post request:", req)
        res.json({ 'message': 'post requests received for listings by id'})
    })