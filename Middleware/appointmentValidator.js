const { body } = require("express-validator");

const appointmentValidationRules = [
  body("shop", "Shop ID is required").notEmpty().isMongoId(),
  body("date", "Valid date is required").notEmpty().isISO8601(),
  body("timeSlot", "Time slot is required").notEmpty().isString(),
  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Invalid status value"),
];

module.exports = { appointmentValidationRules };
