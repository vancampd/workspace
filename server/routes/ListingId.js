const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const fs = require('fs');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage }).single('file')

router
    .route('/images')
    .post((req, res) => {
        upload(req, res, (err) => {
          if (err) {
            res.sendStatus(500);
          }
          res.send(req.file);
        });

        console.log('params', req)

        const listings = getListings()

        // const foundListings = listings.find(listting => listings.id === )
    });





        // console.log('file', req.file)
        // console.log(req.body) 
        // const {images} = req.body;
        // const cloneListing = req.body;
        // const alteredListing = delete cloneListing.images;

        // const imageArray = [images];
        // console.log('imageArray',imageArray);
    // })

    function getListings() {
        const listingsData = fs.readFileSync('./data/listings.json')
        const listings = JSON.parse(listingsData);
        return listings;
    }

router
    .route('/comments/:commentID')
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
    .route('/comments')
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

    module.exports = router;