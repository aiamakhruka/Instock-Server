const knex = require("knex")(require("../knexfile"));
const { body, validationResult } = require("express-validator");

const validateInventory = [
  // Validate presence of required properties
  body("warehouse_id").notEmpty().withMessage("warehouse_id is required"),
  body("item_name").notEmpty().withMessage("item_name is required"),
  body("description").notEmpty().withMessage("description is required"),
  body("category").notEmpty().withMessage("category is required"),
  body("status").notEmpty().withMessage("status is required"),
  body("quantity").notEmpty().withMessage("quantity is required"),

  // Validate that status is either "In Stock" or "Out of Stock"
  body("status")
    .isIn(["In Stock", "Out of Stock"])
    .withMessage('status must be "In Stock" or "Out of Stock"'),

  // Validate the quantity based on the status
  body("quantity").custom((value, { req }) => {
    const status = req.body.status;
    if (status === "Out of Stock" && value !== 0) {
      throw new Error('If status is "Out of Stock", quantity must be 0');
    }
    if (status === "In Stock" && value <= 0) {
      throw new Error(
        'If status is "In Stock", quantity must be a positive integer'
      );
    }
    return true;
  }),

  //   Validate that warehouse_id exists in the warehouses table
  body("warehouse_id").custom((value) => {
    return knex("warehouses")
      .where({ id: value })
      .first()
      .then((warehouse) => {
        if (!warehouse) {
          return Promise.reject("Invalid warehouse_id");
        }
      });
  }),

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
  validateInventory,
};
