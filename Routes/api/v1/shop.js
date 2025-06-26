const express = require("express");
const {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  getShopsByOwner,
  searchShops,
} = require("../../../Controllers/Shop/shopController");

const { shopValidationRules } = require("../../../Middleware/shopValidator");
const validateRequest = require("../../../Middleware/validateRquest");
const authMiddleware = require("../../../Middleware/authMiddleware");
const { shopkeeperOnly } = require("../../../Middleware/shopKeeperOnly");
const adminOnly = require("../../../Middleware/adminOnly");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  shopkeeperOnly,
  shopValidationRules,
  validateRequest,
  createShop
);
router.get("/", authMiddleware, getAllShops);
router.get("/:id", authMiddleware, getShopById);
router.put("/:id", authMiddleware, shopkeeperOnly, updateShop);
router.delete("/:id", adminOnly, deleteShop);
router.get("/owner/:ownerId", authMiddleware, getShopsByOwner);
router.get("/search/query", searchShops);

module.exports = router;
