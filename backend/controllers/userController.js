const User = require("../models/UserModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
const createAdminToken = (email, password) =>
  jwt.sign({ admin: email + password, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    return res
      .status(200)
      .json({ success: true, token: createToken(user._id) });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid Email" });
    if (password.length < 8)
      return res
        .status(400)
        .json({
          success: false,
          message: "Password is less than 8 characters",
        });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ success: true, token: createToken(newUser._id) });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(200)
        .json({ success: true, token: createAdminToken(email, password) });
    }
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !name.trim())
      return res.json({ success: false, message: "Name is required" });
    if (phone && !/^[0-9]{7,15}$/.test(phone.replace(/[\s\-\+\(\)]/g, "")))
      return res.json({ success: false, message: "Invalid phone number" });
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim(), phone: phone || "" },
      { new: true },
    ).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.json({ success: false, message: "All fields required" });
    if (newPassword.length < 8)
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.addresses.length >= 5)
      return res.json({
        success: false,
        message: "Maximum 5 addresses allowed",
      });
    const addr = req.body;
    if (user.addresses.length === 0) addr.isDefault = true;
    else if (addr.isDefault)
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    user.addresses.push(addr);
    await user.save();
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addressId, ...updates } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const addr = user.addresses.id(addressId);
    if (!addr)
      return res.json({ success: false, message: "Address not found" });
    if (updates.isDefault)
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    Object.assign(addr, updates);
    await user.save();
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const addr = user.addresses.id(addressId);
    if (!addr)
      return res.json({ success: false, message: "Address not found" });
    const wasDefault = addr.isDefault;
    user.addresses.pull(addressId);
    if (wasDefault && user.addresses.length > 0)
      user.addresses[0].isDefault = true;
    await user.save();
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    user.addresses.forEach((a) => {
      a.isDefault = a._id.toString() === addressId;
    });
    await user.save();
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
