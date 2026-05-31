import jwt from "jsonwebtoken";
import Booking from "../models/booking.model.js";
import Bus from "../models/bus.model.js";
import User from "../models/user.model.js";
import RouteRate from "../models/RouteRate.model.js";

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


export const getRouteRates = async (req, res) => {
  try {
    const routes = await RouteRate.find({}).sort({ fromCity: 1 });
    res.status(200).json({ success: true, routes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addRouteRate = async (req, res) => {
  try {
    const { fromCity, toCity, distanceKm, rates } = req.body;

    if (!fromCity || !toCity || !distanceKm) {
      return res.status(400).json({ success: false, message: "fromCity, toCity, distanceKm required" });
    }

    const existing = await RouteRate.findOne({
      $or: [
        { fromCity, toCity },
        { fromCity: toCity, toCity: fromCity }
      ]
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Route already exists. Use update instead." });
    }

    const route = await RouteRate.create({
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      distanceKm: Number(distanceKm),
      rates: {
        AC:       rates?.AC       || 15,
        "Non-AC": rates?.["Non-AC"] || 10,
        Sleeper:  rates?.Sleeper  || 20,
        Mini:     rates?.Mini     || 8
      }
    });

    res.status(201).json({ success: true, message: "Route added successfully", route });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateRouteRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { distanceKm, rates, isActive } = req.body;

    const route = await RouteRate.findByIdAndUpdate(
      id,
      { distanceKm, rates, isActive },
      { new: true, runValidators: true }
    );

    if (!route) return res.status(404).json({ success: false, message: "Route not found" });

    res.status(200).json({ success: true, message: "Route updated", route });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteRouteRate = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await RouteRate.findByIdAndDelete(id);
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    res.status(200).json({ success: true, message: "Route deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const calculateRoutePrice = async (req, res) => {
  try {
    const { fromCity, toCity, busType } = req.query;

    if (!fromCity || !toCity || !busType) {
      return res.status(400).json({ success: false, message: "fromCity, toCity, busType required" });
    }

    const route = await RouteRate.findOne({
      $or: [
        { fromCity: fromCity.trim(), toCity: toCity.trim() },
        { fromCity: toCity.trim(), toCity: fromCity.trim() }
      ],
      isActive: true
    });

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not configured by admin" });
    }

    const ratePerKm = route.rates[busType] || 12;
    const rawPrice = Math.ceil(route.distanceKm * ratePerKm);
    const finalPrice = Math.ceil(rawPrice / 50) * 50; 

    res.status(200).json({
      success: true,
      price: finalPrice,
      distanceKm: route.distanceKm,
      ratePerKm,
      allPrices: {
        AC:       Math.ceil(Math.ceil(route.distanceKm * route.rates.AC)       / 50) * 50,
        "Non-AC": Math.ceil(Math.ceil(route.distanceKm * route.rates["Non-AC"]) / 50) * 50,
        Sleeper:  Math.ceil(Math.ceil(route.distanceKm * route.rates.Sleeper)  / 50) * 50,
        Mini:     Math.ceil(Math.ceil(route.distanceKm * route.rates.Mini)     / 50) * 50,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};