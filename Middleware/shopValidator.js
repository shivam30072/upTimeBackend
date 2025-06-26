const { body } = require("express-validator");

const shopValidationRules = [
  body("name").notEmpty().withMessage("Shop name is required"),
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .isMobilePhone()
    .withMessage("Invalid contact number"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["clinic", "salon", "parlor", "other"])
    .withMessage("Invalid shop type"),
  body("address").notEmpty().withMessage("Address is required"),
  body("openingTime").notEmpty().withMessage("Opening time is required"),
  body("closingTime").notEmpty().withMessage("Closing time is required"),
  body("slotDuration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Slot duration must be a positive number"),
];

module.exports = { shopValidationRules };
