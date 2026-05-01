import jwt from "jsonwebtoken";
import Booking from "../models/booking.model.js";
import Bus from "../models/bus.model.js";
import User from "../models/user.model.js";

export const ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (email !== process.env.OWNER_EMAIL) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (password !== process.env.OWNER_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, role: "owner" },
      process.env.OWNER_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      admin:email,
      token,
      message: "Login successful",
    });

  } catch (error) {
    console.error("Owner login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBookings = async (req,res) => {
  try {
    const bookings = await Booking.find({ }).populate("user").populate("bus").sort({ createdAt:-1 })
    res.status(200).json({
      success:true,
      bookings
    })
  } catch (error) {
    console.error("Owner Booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getAdminBuses = async (req,res) => {
  try {
    const buses = await Bus.find({})
    res.status(200).json({
      success:true,
      buses
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getAdminUsers = async (req,res) => {
  try {
    const users = await User.find({})
    res.status(200).json({
      success:true,
      users
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}