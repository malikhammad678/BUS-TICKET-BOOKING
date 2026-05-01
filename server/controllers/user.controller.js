import { generateTokens } from "../configs/generateTokens.js";
import Booking from "../models/booking.model.js";
import Bus from "../models/bus.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || ""
    });

    const token = generateTokens(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });


    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "Your account has been blocked. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateTokens(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });

  } catch (error) {
    console.error("Toggle block error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTotalUsers = async (req,res) => {
  try {
    const totalUsers = await User.countDocuments()
    res.status(200).json({
      success:true,
      totalUsers
    })
  } catch (error) {
    console.error("users Getting error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getTotalBookings = async (req,res) => {
  try {
    const totalBookings = await Booking.countDocuments()
  
    res.status(200).json({
      success:true,
      totalBookings
    })
  } catch (error) {
    console.error("Bookings Getting error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getTotalBuses = async (req,res) => {
  try {
    const totalBuses = await Bus.countDocuments()
  
    res.status(200).json({
      success:true,
      totalBuses
    })
  } catch (error) {
    console.error("Buses Getting error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user || user.isBlocked) {
      return res.status(403).json({ success: false, message: "Account blocked." })
    }

    return res.status(200).json({ success: true, user })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getBuses = async (req,res) => {
  try {
    const buses = await Bus.find({})
    res.status(200).json({
      success:true,
      buses
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}