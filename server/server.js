require('dotenv').config();

const { JWT_SECRET } = process.env;

// Refuse to start with a missing or placeholder secret: anyone who knows it can forge logins.
if (!JWT_SECRET || JWT_SECRET === 'replace_me' || JWT_SECRET.length < 32) {
  console.error(
    'JWT_SECRET must be set to a random value of at least 32 characters. ' +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
  );
  process.exit(1);
}

const app = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
