// models/Shop.js
const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    type: {
      type: String,
      enum: ["clinic", "salon", "parlor", "other"],
      required: true,
    },
    address: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    slotDuration: { type: Number, default: 30 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
