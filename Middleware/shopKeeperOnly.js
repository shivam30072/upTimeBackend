const shopkeeperOnly = (req, res, next) => {
  if (req.user.role !== "shopkeeper") {
    return res.status(403).json({ error: "Only shopkeepers can create shops" });
  }
  next();
};

module.exports = { shopkeeperOnly };
