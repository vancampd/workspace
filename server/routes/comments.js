const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');

router
    .route('/')
    .get((req, res) => {
        console.log("Comments get request:", req)
        res.json({ 'message': 'get requests received for comments by listingID'})
    })
    .post((req, res) => {
        console.log("Comments post request:", req)
        res.json({ 'message': 'post requests received for comments by listingID'})
    })

router
    .route('/:commentID')
    .delete((req, res) => {
        console.log("Comments by id delete request:", req)
        res.json({ 'message': 'delete requests received for comments by commentID'})
    })
    