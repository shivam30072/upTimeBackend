const express = require("express");

const validateRequest = require("../../../Middleware/validateRquest");
const authMiddleware = require("../../../Middleware/authMiddleware");
const adminOnly = require("../../../Middleware/adminOnly");
const {
  appointmentValidationRules,
} = require("../../../Middleware/appointmentValidator");
const {
  createAppointment,
  getAppointmentsByShop,
  updateAppointmentStatus,
} = require("../../../Controllers/Appointment/appointmentController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  appointmentValidationRules,
  validateRequest,
  createAppointment
);
router.get("/:shopId", authMiddleware, getAppointmentsByShop);
router.get("/:id/status", authMiddleware, updateAppointmentStatus);
module.exports = router;
