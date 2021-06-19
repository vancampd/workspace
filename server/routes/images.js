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
    .route('/')
    .post((req, res) => {
        upload(req, res, (err) => {
          if (err) {
            res.sendStatus(500);
          }
          res.send(req.file);
        });

        console.log('params', req.body)

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

module.exports = router;