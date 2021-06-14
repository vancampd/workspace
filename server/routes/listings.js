const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');

router
    .route('/')
    .get((req, res) => {
        console.log("Received listings get request")

        const listings = getListings();

        res.json(listings);
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

function getListings() {
    const listingsData = fs.readFileSync('./data/listings.json')
    const listings = JSON.parse(listingsData);
    return listings;
}

  
// function writeInventory(data) {
// fs.writeFileSync("./data/inventories.json", JSON.stringify(data));
// console.log("New Data written to ./data/inventories.json");
// }

module.exports = router;