const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
  );
  return token;
};

module.exports = createToken;
