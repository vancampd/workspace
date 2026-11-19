const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { readUsers, writeUsers } = require('../lib/dataStore');
const rateLimit = require('../middleware/rateLimit');

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores everything after 72 bytes, so longer passwords would be silently truncated.
const MAX_PASSWORD_BYTES = 72;
const INVALID_CREDENTIALS = 'Invalid username or password';

// Compared against when the username doesn't exist, so a missing user takes as long
// to reject as a wrong password and response times don't reveal which usernames exist.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', BCRYPT_ROUNDS);

const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
});

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';
const sameUsername = (a, b) => a.toLowerCase() === b.toLowerCase();

router.post('/register', registerLimiter, async (req, res) => {
  const { name, username, password } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(username) || typeof password !== 'string') {
    return res.status(400).json({ message: 'Please enter the required fields.' });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  }

  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    return res.status(400).json({ message: 'Password is too long.' });
  }

  const trimmedUsername = username.trim();

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const users = readUsers();

    if (users.some((user) => sameUsername(user.username, trimmedUsername))) {
      return res.status(409).json({ message: 'That username is already taken.' });
    }

    users.push({
      name: name.trim(),
      username: trimmedUsername,
      password: hashedPassword,
      favorites: [],
    });
    writeUsers(users);

    return res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration failed', error);
    return res.status(500).json({ message: 'Failed registration' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};

  if (!isNonEmptyString(username) || typeof password !== 'string' || password === '') {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const users = readUsers();
    const foundUser = users.find((user) => sameUsername(user.username, username.trim()));
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser ? foundUser.password : DUMMY_HASH
    );

    if (!foundUser || !isPasswordCorrect) {
      return res.status(401).json({ message: INVALID_CREDENTIALS });
    }

    // Upgrade hashes created with the old, weaker cost factor now that we have the plaintext.
    if (bcrypt.getRounds(foundUser.password) < BCRYPT_ROUNDS) {
      foundUser.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
      writeUsers(users);
    }

    const token = jwt.sign(
      { name: foundUser.name, username: foundUser.username },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '24h' }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Login failed' });
  }
});

router.registerLimiter = registerLimiter;
router.loginLimiter = loginLimiter;

module.exports = router;
