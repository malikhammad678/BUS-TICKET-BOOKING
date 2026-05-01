import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Bus from "../models/bus.model.js";

const generateBookingId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BK";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const createBooking = async (req, res) => {
  try {
    const {
      busId,
      passengerName,
      gender,
      phone,
      cnic,
      paymentMethod,
      paymentNumber
    } = req.body;

    const userId = req.user._id;

    if (!busId || !passengerName || !gender || !phone || !cnic || !paymentMethod || !paymentNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

  
    let bookingId;
    let isUnique = false;

    while (!isUnique) {
      bookingId = generateBookingId();
      const existing = await Booking.findOne({ bookingId });
      if (!existing) isUnique = true;
    }

  
    const booking = await Booking.create({
      bookingId,
      user: userId,
      bus: busId,

      fromCity: bus.fromCity,
      toCity: bus.toCity,
      price: bus.price,

      passengerName,
      gender,
      phone,
      cnic,
      paymentMethod,
      paymentNumber,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("bus")
      .populate("user", "-password");

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking
    });

  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("bus")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, bookings });

  } catch (error) {
    console.error("Get user bookings error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bus")
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, bookings });

  } catch (error) {
    console.error("Get all bookings error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    ).populate("bus").populate("user", "-password");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({ success: true, message: "Status updated successfully", booking });

  } catch (error) {
    console.error("Update booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await User.findByIdAndUpdate(booking.user, {
      $pull: { bookings: booking._id }
    });

    return res.status(200).json({ success: true, message: "Booking deleted successfully" });

  } catch (error) {
    console.error("Delete booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

