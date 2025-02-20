const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require('../middleware/authVerify'); 

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, job_type } = req.body;
    const user = new User({ name, email, password, job_type });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie('authToken', token, {
      httpOnly: true,  // The cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (requires HTTPS)
      sameSite: 'Strict',  // Mitigates CSRF attacks
      maxAge: 3600000  // Expiry time of 1 hour (optional)
    });



    res.json({ token, user: { name: user.name, email: user.email, job_type: user.job_type } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the token (it should be in req.user.userId)
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing from token' });
    }
    
    // Fetch the user from the database by userId
    const user = await User.findById(userId); // Use `findById` to search for the user by their ID
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Send back the user data
    res.json({
      name: user.name,
      email: user.email,
      job_type: user.job_type
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

router.get('/verify-token', authenticateToken, (req, res) => {
  return res.status(200).json({
    message: 'Token is valid',
    user: req.user // Send user information decoded from the token
  });
});


module.exports = router;
