const fs = require('fs');
const path = require('path');

// Resolve data files from DATA_DIR (used by tests) or the server's own data folder,
// so reads and writes no longer depend on the directory the server was started from.
const dataDir = () => process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(dataDir(), file), 'utf8'));

const writeJson = (file, data) =>
  fs.writeFileSync(path.join(dataDir(), file), JSON.stringify(data));

module.exports = {
  readUsers: () => readJson('users.json'),
  writeUsers: (users) => writeJson('users.json', users),
  readListings: () => readJson('listings.json'),
  writeListings: (listings) => writeJson('listings.json', listings),
};
