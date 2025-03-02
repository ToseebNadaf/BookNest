const translate = require("../utils/translate");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const lang = req.headers["accept-language"] || "en";
    const errors = error.details.map((detail) => ({
      message: translate(detail.message, lang),
      field: detail.context.key,
    }));
    return res.status(400).json({ success: false, errors });
  }
  next();
};

module.exports = validate;
