const router = require("express").Router();

router.get("/", (req, res) => {
  return res.status(200).json({ message: "APIs running successfully" });
});

router.use("/api", require("./api"));

module.exports = router;
