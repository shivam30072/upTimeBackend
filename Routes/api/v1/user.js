const {
  requestOtp,
  verifyOtp,
  logout,
  getAllUsers,
} = require("../../../Controllers/User/userController");
const adminOnly = require("../../../Middleware/adminOnly");
const authMiddleware = require("../../../Middleware/authMiddleware");

// url here is `/api/v1/user`
const router = require("express").Router();

router.post("/requestOtp", requestOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/logout", authMiddleware, logout);
router.get("/all", authMiddleware, adminOnly, getAllUsers);

module.exports = router;
