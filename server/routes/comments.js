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
        const {listingID, name, comment, rating} = req.body;

        console.log('received request to post comment')

        const listingsData = fs.readFileSync('./data/listings.json');
        const listings = JSON.parse(listingsData);
        const mainListing = listings.find(listing => listing.id === listingID);
        const comments = mainListing.comments;

        const newComment = {
            "commentID": uuidv4(),
            name,
            comment,
            rating,
            "date": Date.now()
        }

        comments.push(newComment)

        listings.forEach(listing => {
            if(listing.id === listingID){
                listing.comments = comments
            }
        })

        fs.writeFileSync('./data/listings.json', JSON.stringify(listings))

        mainListing.comments = comments;

        res.json(mainListing)
    })

router
    .route('/:commentID')
    .delete((req, res) => {
        const {listingID, commentID} = req.body;

        const listingsData = fs.readFileSync('./data/listings.json');
        const listings = JSON.parse(listingsData);
        const mainListing = listings.find(listing => listing.id === listingID);
        const comments = mainListing.comments;

        const newComments = comments.filter(comment => comment.commentID !== commentID)

        listings.forEach(listing => {
            if(listing.id === listingID){
                listing.comments = newComments
            }
        })

        fs.writeFileSync('./data/listings.json', JSON.stringify(listings))

        mainListing.comments = newComments;

        res.json(mainListing)
    })

module.exports = router;