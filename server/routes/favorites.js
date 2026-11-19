const router = require('express').Router();
const { readUsers, writeUsers } = require('../lib/dataStore');
const requireAuth = require('../middleware/requireAuth');

// Favorites are private: every route needs a signed-in user, and the user is taken
// from the token rather than the URL. The :name segment is kept so the client API
// doesn't change yet, but it must match the signed-in user.
router.use(requireAuth);

router.param('name', (req, res, next, name) => {
  if (name !== req.user.name) {
    return res.status(403).json({ message: 'You can only access your own favorites' });
  }
  return next();
});

const findCurrentUser = (users, req) =>
  users.find((user) => user.username === req.user.username);

router
  .route('/:name')
  .get((req, res) => {
    const user = findCurrentUser(readUsers(), req);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json(user.favorites || []);
  })
  .post((req, res) => {
    const favorite = req.body;
    if (!favorite || typeof favorite.id !== 'string') {
      return res.status(400).json({ message: 'A listing id is required' });
    }

    const users = readUsers();
    const user = findCurrentUser(users, req);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites || [];
    if (user.favorites.some((existing) => existing.id === favorite.id)) {
      return res.status(400).json({ message: 'error posting favorite' });
    }

    user.favorites.push(favorite);
    writeUsers(users);

    return res.json(user.favorites);
  });

router.route('/:name/:listingId').delete((req, res) => {
  const users = readUsers();
  const user = findCurrentUser(users, req);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.favorites = (user.favorites || []).filter(
    (favorite) => favorite.id !== req.params.listingId
  );
  writeUsers(users);

  return res.json(user.favorites);
});

module.exports = router;
