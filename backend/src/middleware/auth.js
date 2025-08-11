const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/error');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Unauthorized');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) throw new ApiError(401, 'Unauthorized');
    req.user = { id: user.id, isAdmin: user.isAdmin };
    next();
  } catch (e) {
    next(new ApiError(401, 'Unauthorized'));
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return next(new ApiError(403, 'Forbidden'));
  next();
};

module.exports = { auth, adminOnly };