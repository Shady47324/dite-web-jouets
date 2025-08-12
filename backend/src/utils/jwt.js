const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { signToken };