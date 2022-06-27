const crypto = require('crypto');

function tokenGenerate() {
  return crypto.randomBytes(8).toString('hex');
}

module.exports = tokenGenerate;