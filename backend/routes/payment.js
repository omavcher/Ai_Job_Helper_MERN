const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const User = require("../models/User"); // ✅ Import your User model

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 Route to Create Order
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 4000, // ₹40 (Razorpay takes amount in paise, so ₹40 = 4000)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
});

// 🔹 Route to Verify Payment Signature
router.post("/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
  
    try {
      // ✅ Generate Signature for Verification
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
  
      if (generated_signature === razorpay_signature) {
        // ✅ Update User Subscription to "paid"
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: { subscription: "paid" } }, // ✅ Update subscription field
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
  
        return res.json({ success: true, message: "Payment verified & Subscription Updated", user: updatedUser });
      } else {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("🚨 Payment Verification Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

module.exports = router;
