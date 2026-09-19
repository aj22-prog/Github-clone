const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "mysecretkey";

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User with that username or email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ token, userId: savedUser._id });
  } catch (err) {
    console.error("Error during signup : ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err);
    res.status(500).json({ message: "Server error!", error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err);
    res.status(500).json({ message: "Server error!", error: err.message });
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(currentID)) {
      return res.status(400).json({ message: "Invalid user ID format!" });
    }

    const user = await User.findById(currentID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error during fetching : ", err);
    res.status(500).json({ message: "Server error!", error: err.message });
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(currentID)) {
      return res.status(400).json({ message: "Invalid user ID format!" });
    }

    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentID,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error during updating : ", err);
    res.status(500).json({ message: "Server error!", error: err.message });
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(currentID)) {
      return res.status(400).json({ message: "Invalid user ID format!" });
    }

    const result = await User.findByIdAndDelete(currentID);
    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during deleting : ", err);
    res.status(500).json({ message: "Server error!", error: err.message });
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};