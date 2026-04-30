const validate = (schema) => (req, res, next) => {
  if (!schema || typeof schema.validate !== 'function') {
    return res.status(500).json({
      message: 'Validation schema is not configured correctly.',
    });
  }

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = validate;