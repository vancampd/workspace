const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  },
}).single('file')

// Parses the multipart body (image + `listing` JSON field) before the create handler runs.
const handleListingUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'An image is required' })
        }

        try {
            req.listingData = JSON.parse(req.body.listing)
        } catch (parseError) {
            fs.unlink(req.file.path, () => {})
            return res.status(400).json({ message: 'Invalid listing data' })
        }

        next()
    })
}

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
        const {listingID, commentID} = req.params;

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
    .post(handleListingUpload, (req, res) => {

        const newListing = {
            ...req.listingData,
            id:uuidv4(),
            comments:[],
            images:[`${req.protocol}://${req.get('host')}/public/${req.file.filename}`],
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
