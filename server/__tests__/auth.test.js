const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-hs256-signing';

const app = require('../app');
const usersRouter = require('../routes/users');

let dataDir;

const seedListings = [
  {
    id: 'listing-1',
    name: 'Owner User',
    username: 'owner',
    comments: [
      { commentID: 'legacy-comment', name: 'Legacy Author', comment: 'old', rating: 4 },
    ],
    images: [],
  },
];

const readData = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
const tokenFor = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
const auth = (user) => ({ Authorization: `Bearer ${tokenFor(user)}` });

const owner = { name: 'Owner User', username: 'owner' };
const other = { name: 'Other User', username: 'other' };

const register = (body) => request(app).post('/users/register').send(body);
const login = (body) => request(app).post('/users/login').send(body);

beforeEach(() => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-test-'));
  process.env.DATA_DIR = dataDir;
  fs.writeFileSync(
    path.join(dataDir, 'users.json'),
    JSON.stringify([
      { ...owner, password: bcrypt.hashSync('password123', 4), favorites: [] },
      { ...other, password: bcrypt.hashSync('password123', 4), favorites: [] },
    ])
  );
  fs.writeFileSync(path.join(dataDir, 'listings.json'), JSON.stringify(seedListings));
  usersRouter.loginLimiter.reset();
  usersRouter.registerLimiter.reset();
});

afterEach(() => {
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('POST /users/register', () => {
  test('creates a user with a hashed password', async () => {
    const res = await register({ name: 'New User', username: 'newbie', password: 'password123' });

    expect(res.status).toBe(201);
    const saved = readData('users.json').find((user) => user.username === 'newbie');
    expect(saved.password).not.toBe('password123');
    expect(bcrypt.getRounds(saved.password)).toBeGreaterThanOrEqual(12);
  });

  test.each([
    [{ name: 'A', password: 'password123' }],
    [{ name: 'A', username: 'a' }],
    [{ username: 'a', password: 'password123' }],
  ])('rejects missing fields %#', async (body) => {
    const res = await register(body);
    expect(res.status).toBe(400);
  });

  test('rejects short and over-long passwords', async () => {
    expect((await register({ name: 'A', username: 'a', password: 'short' })).status).toBe(400);
    expect(
      (await register({ name: 'A', username: 'a', password: 'x'.repeat(73) })).status
    ).toBe(400);
  });

  test('rejects a username that is already taken, ignoring case', async () => {
    const res = await register({ name: 'Copy', username: 'OWNER', password: 'password123' });
    expect(res.status).toBe(409);
    expect(readData('users.json')).toHaveLength(2);
  });
});

describe('POST /users/login', () => {
  test('returns a token for valid credentials', async () => {
    const res = await login({ username: 'owner', password: 'password123' });

    expect(res.status).toBe(200);
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload).toMatchObject(owner);
  });

  test('gives the same response for an unknown user and a wrong password', async () => {
    const unknown = await login({ username: 'nobody', password: 'password123' });
    const wrong = await login({ username: 'owner', password: 'wrong-password' });

    expect(unknown.status).toBe(401);
    expect(wrong.status).toBe(401);
    expect(unknown.body).toEqual(wrong.body);
  });

  test('upgrades weak password hashes after a successful login', async () => {
    await login({ username: 'owner', password: 'password123' });

    const saved = readData('users.json').find((user) => user.username === 'owner');
    expect(bcrypt.getRounds(saved.password)).toBeGreaterThanOrEqual(12);
  });

  test('rate limits repeated login attempts', async () => {
    for (let i = 0; i < 10; i += 1) {
      await login({ username: 'owner', password: 'wrong-password' });
    }
    const res = await login({ username: 'owner', password: 'password123' });

    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();
  });
});

describe('authentication on write routes', () => {
  test.each([
    ['post', '/listings'],
    ['post', '/listings/listing-1/images'],
    ['post', '/listings/listing-1/comments'],
    ['delete', '/listings/listing-1/comments/legacy-comment'],
    ['get', '/favorites/Owner User'],
    ['post', '/favorites/Owner User'],
    ['delete', '/favorites/Owner User/listing-1'],
  ])('%s %s requires a token', async (method, url) => {
    const res = await request(app)[method](url).send({});
    expect(res.status).toBe(401);
  });

  test('rejects a token signed with another secret', async () => {
    const forged = jwt.sign(owner, 'not-the-real-secret');
    const res = await request(app)
      .get('/favorites/Owner User')
      .set('Authorization', `Bearer ${forged}`);

    expect(res.status).toBe(401);
  });

  test('rejects an unsigned token', async () => {
    const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const unsigned = `${encode({ alg: 'none', typ: 'JWT' })}.${encode(owner)}.`;
    const res = await request(app)
      .get('/favorites/Owner User')
      .set('Authorization', `Bearer ${unsigned}`);

    expect(res.status).toBe(401);
  });

  test('keeps public reads public', async () => {
    expect((await request(app).get('/listings')).status).toBe(200);
  });
});

describe('listings and comments', () => {
  test('takes the listing owner from the token, not the body', async () => {
    const res = await request(app)
      .post('/listings')
      .set(auth(owner))
      .send({ title: 'Desk', name: 'Someone Else', id: 'chosen-id' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Desk', name: 'Owner User', username: 'owner' });
    expect(res.body.id).not.toBe('chosen-id');
  });

  test('takes the comment author from the token', async () => {
    const res = await request(app)
      .post('/listings/listing-1/comments')
      .set(auth(other))
      .send({ listingID: 'listing-1', name: 'Owner User', comment: 'Nice', rating: 5 });

    const created = res.body.comments.at(-1);
    expect(created).toMatchObject({ name: 'Other User', username: 'other', comment: 'Nice' });
  });

  test('only lets authors delete their comments', async () => {
    const created = await request(app)
      .post('/listings/listing-1/comments')
      .set(auth(owner))
      .send({ comment: 'Mine', rating: 5 });
    const commentID = created.body.comments.at(-1).commentID;

    const forbidden = await request(app)
      .delete(`/listings/listing-1/comments/${commentID}`)
      .set(auth(other));
    expect(forbidden.status).toBe(403);

    const allowed = await request(app)
      .delete(`/listings/listing-1/comments/${commentID}`)
      .set(auth(owner));
    expect(allowed.status).toBe(200);
    expect(allowed.body.comments.some((c) => c.commentID === commentID)).toBe(false);
  });

  test('matches legacy comments by display name', async () => {
    const res = await request(app)
      .delete('/listings/listing-1/comments/legacy-comment')
      .set(auth({ name: 'Legacy Author', username: 'legacy' }));

    expect(res.status).toBe(200);
  });

  test("blocks image uploads to someone else's listing", async () => {
    const res = await request(app).post('/listings/listing-1/images').set(auth(other));
    expect(res.status).toBe(403);
  });

  test('returns 404 for comments on a missing listing', async () => {
    const res = await request(app)
      .post('/listings/missing/comments')
      .set(auth(owner))
      .send({ comment: 'Hi', rating: 3 });
    expect(res.status).toBe(404);
  });
});

describe('favorites', () => {
  test("blocks access to another user's favorites", async () => {
    const res = await request(app).get('/favorites/Owner User').set(auth(other));
    expect(res.status).toBe(403);
  });

  test('adds and removes favorites for the signed-in user', async () => {
    const added = await request(app)
      .post('/favorites/Owner User')
      .set(auth(owner))
      .send({ id: 'listing-1' });
    expect(added.body).toEqual([{ id: 'listing-1' }]);

    const removed = await request(app)
      .delete('/favorites/Owner User/listing-1')
      .set(auth(owner));
    expect(removed.body).toEqual([]);

    const otherUser = readData('users.json').find((user) => user.username === 'other');
    expect(otherUser.favorites).toEqual([]);
  });
});
