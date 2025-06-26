const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    mobile: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["user", "shopkeeper", "admin"],
      required: true,
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    token: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.generateJwt = function () {
  return jwt.sign(
    {
      id: this._id,
      mobile: this.mobile,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

userSchema.post("save", async function (doc, next) {
  try {
    if (!doc.token) {
      doc.token = doc.generateJwt();
      await doc.save();
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
