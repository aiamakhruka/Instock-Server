const knex = require("knex")(require("../knexfile"));
const { body, validationResult } = require("express-validator");

const validateWarehouse = [
  body("warehouse_name").notEmpty().withMessage("Warehouse name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("city")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Invalid city name"),
  body("country").notEmpty().withMessage("country is required"),
  body("country")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Invalid country name "),
  body("contact_name").notEmpty().withMessage("Contact name is required"),
  body("contact_position")
    .notEmpty()
    .withMessage("Contact position is required"),
  body("contact_phone").notEmpty().withMessage("Contact phone is required"),
  body("contact_phone")
    .custom((value) => {
      // Validate the remaining phone number format
      return /^\+1\s?\(\d{3}\)\s?\d{3}-\d{4}$/.test(value);
    })
    .withMessage(
      "Invalid phone number, the format should follow: +1 (xxx) xxx-xxxx"
    ),
  body("contact_email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email address"),

  // Custom middleware function to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validation passed, move to the next middleware or route handler
    next();
  },
];

module.exports = {
  validateWarehouse,
};
