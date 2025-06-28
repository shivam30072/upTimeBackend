const User = require("../../Models/User");
const jwt = require("jsonwebtoken");

const requestOtp = async (req, res) => {
  try {
    const { mobile, role } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      if (!role || !["user", "shopkeeper", "admin"].includes(role)) {
        return res.status(400).json({
          message:
            "Role is required for new users and must be either 'user' or 'shopkeeper'",
        });
      }

      user = new User(req.body);
    }

    // const otp = generateOtp();
    const otp = "123456";
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`OTP for login: ${otp}`);

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error("Error in requestOtp:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });

    console.log(
      `Verifying OTP for mobile: ${mobile}, OTP: ${otp}, user ${user}`
    );

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    user.token = user.generateJwt();
    
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token: user.token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during logout" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-otp -otpExpiry") // Exclude sensitive fields
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: sort by newest

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  logout,
  getAllUsers,
};
