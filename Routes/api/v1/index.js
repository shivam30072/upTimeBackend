const router = require("express").Router();
const userRoutes = require("./user");
const shopRoutes = require("./shop");
const appointmentRoutes = require("./appointment");

router.use("/user", userRoutes);
router.use("/shop", shopRoutes);
router.use("/appointment", appointmentRoutes);

module.exports = router;
