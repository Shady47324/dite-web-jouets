const { ApiError } = require('../utils/error');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return next(new ApiError(400, error.message));
  req.body = value;
  next();
};

module.exports = { validate };