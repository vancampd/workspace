const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { readListings, writeListings } = require('../lib/dataStore');
const requireAuth = require('../middleware/requireAuth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file');

// Older records only have the author's display name; newer ones also store the username,
// which is what ownership checks use when it's present.
const isOwner = (resource, user) =>
  resource.username ? resource.username === user.username : resource.name === user.name;

router.route('/:listingID/images').post(requireAuth, (req, res) => {
  const { listingID } = req.params;
  const listing = readListings().find((item) => item.id === listingID);

  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (!isOwner(listing, req.user)) {
    return res.status(403).json({ message: 'You can only add images to your own listings' });
  }

  upload(req, res, (err) => {
    if (err) return res.sendStatus(500);
    if (!req.file) return res.status(400).json({ message: 'An image file is required' });

    const listings = readListings();
    listings.forEach((item) => {
      if (item.id === listingID) {
        item.images = [`http://localhost:8080/${req.file.path}`];
      }
    });
    writeListings(listings);

    return res.send(req.file.path);
  });
});

router
  .route('/:listingID/comments')
  .get((req, res) => {
    res.json({ message: 'get requests received for comments by listingID' });
  })
  .post(requireAuth, (req, res) => {
    const { listingID } = req.params;
    const { comment, rating } = req.body || {};

    const listings = readListings();
    const mainListing = listings.find((listing) => listing.id === listingID);
    if (!mainListing) return res.status(404).json({ message: 'Listing not found' });

    mainListing.comments = mainListing.comments || [];
    mainListing.comments.push({
      commentID: uuidv4(),
      // The author comes from the token, never from the request body.
      name: req.user.name,
      username: req.user.username,
      comment,
      rating,
      date: Date.now(),
    });
    writeListings(listings);

    res.json(mainListing);
  });

router.route('/:listingID/comments/:commentID').delete(requireAuth, (req, res) => {
  const { listingID, commentID } = req.params;

  const listings = readListings();
  const mainListing = listings.find((listing) => listing.id === listingID);
  if (!mainListing) return res.status(404).json({ message: 'Listing not found' });

  const target = (mainListing.comments || []).find((comment) => comment.commentID === commentID);
  if (!target) return res.status(404).json({ message: 'Comment not found' });
  if (!isOwner(target, req.user)) {
    return res.status(403).json({ message: 'You can only delete your own comments' });
  }

  mainListing.comments = mainListing.comments.filter((comment) => comment.commentID !== commentID);
  writeListings(listings);

  res.json(mainListing);
});

router
  .route('/')
  .get((req, res) => {
    res.json(readListings());
  })
  .post(requireAuth, (req, res) => {
    const newListing = {
      ...req.body,
      // Server-controlled fields are set after the spread so the client can't override them.
      id: uuidv4(),
      comments: [],
      images: [],
      name: req.user.name,
      username: req.user.username,
    };

    const listings = readListings();
    listings.push(newListing);
    writeListings(listings);

    res.json(newListing);
  });

router
  .route('/:listingID')
  .get((req, res) => {
    res.json({ message: 'get requests received for listings by id' });
  })
  .post((req, res) => {
    res.json({ message: 'post requests received for listings by id' });
  });

module.exports = router;
