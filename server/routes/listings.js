const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' +file.originalname)
  }
})

const upload = multer({ storage: storage }).single('file')

router
    .route('/:listingID/images')
    .post((req, res) => {
        upload(req, res, (err) => {
            if (err) {
                res.sendStatus(500);
            }

            console.log('params', req.params);
            const{listingID} = req.params;

            const listings = getListings();

            listings.forEach(listing => {
                if(listing.id === listingID){
                    listing.images = [`http://localhost:8080/${req.file.path}`]
                }
            })
    
            fs.writeFile('./data/listings.json', JSON.stringify(listings), ()=>{
                return res.send(req.file.path);
            })

            
        })
    })

    router
    .route('/:listingID/comments')
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
    .route('/:listingID/comments/:commentID')
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

router
    .route('/')
    .get((req, res) => {
        console.log("Received listings get request")

        const listings = getListings();

        res.json(listings);
    })
    .post((req, res) => {
        console.log("Listings post request:", req.body)

        const newListing = {
            id:uuidv4(),
            comments:[],
            ...req.body,
        }

        const listings = getListings();

        listings.push(newListing)

        fs.writeFileSync("./data/listings.json", JSON.stringify(listings));

        res.json(newListing)
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

module.exports = router;