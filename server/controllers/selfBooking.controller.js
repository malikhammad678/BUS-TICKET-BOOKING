import TemporaryBus from "../models/TemporaryBus.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import SeatLock from "../models/SeatLock.model.js";
import { sendBookingEmail } from "../utils/sendEmail.js";
import { sendBookingSMS } from "../utils/sendSMS.js";

const generateBookingId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "SB";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const createTemporaryBus = async (req, res) => {
  try {
    const { fromCity, toCity, date, departureTime, price, busType, busName } = req.body;
    const userId = req.user._id;
    
    if (!fromCity || !toCity || !date || !departureTime || !price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ success: false, message: "Please select a future date" });
    }
    
    const tempBus = await TemporaryBus.create({
      createdBy: userId,
      fromCity,
      toCity,
      date,
      departureTime,
      price: Number(price),
      busType: busType || "AC",
      busName: busName || `${fromCity} → ${toCity} Trip`,
      totalSeats: 40,
      bookedSeats: [],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    return res.status(201).json({
      success: true,
      message: "Trip created successfully!",
      tempBusId: tempBus._id,
      tempBus
    });
    
  } catch (error) {
    console.error("Create temporary bus error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTemporaryBus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const tempBus = await TemporaryBus.findOne({ _id: id, createdBy: userId, isActive: true });
    
    if (!tempBus) {
      return res.status(404).json({ success: false, message: "Trip not found or expired" });
    }
    
    const allSeats = Array.from({ length: tempBus.totalSeats }, (_, i) => i + 1);
    const availableSeats = allSeats.filter(seat => !tempBus.bookedSeats.includes(seat));
    
    return res.status(200).json({
      success: true,
      tempBus,
      availableSeats,
      totalSeats: tempBus.totalSeats,
      bookedSeats: tempBus.bookedSeats
    });
    
  } catch (error) {
    console.error("Get temporary bus error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const lockSeatsForTempBus = async (req, res) => {
  try {
    const { tempBusId, seatNumbers } = req.body;
    const userId = req.user._id;
    
    const tempBus = await TemporaryBus.findOne({ _id: tempBusId, createdBy: userId, isActive: true });
    
    if (!tempBus) {
      return res.status(404).json({ success: false, message: "Trip not found or expired" });
    }
    
    const alreadyBooked = seatNumbers.some(seat => tempBus.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(409).json({ success: false, message: "Some seats are already booked" });
    }
    
    const existingLock = await SeatLock.findOne({
      busId: tempBusId,
      date: tempBus.date,
      seatNumbers: { $in: seatNumbers },
      expiresAt: { $gt: new Date() },
      userId: { $ne: userId }
    });
    
    if (existingLock) {
      return res.status(409).json({ success: false, message: "Seats are being booked by another user" });
    }
    
    await SeatLock.deleteMany({ busId: tempBusId, date: tempBus.date, userId });
    
    const lock = await SeatLock.create({
      busId: tempBusId,
      date: tempBus.date,
      seatNumbers,
      userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });
    
    return res.status(200).json({
      success: true,
      message: "Seats locked for 10 minutes",
      lockId: lock._id,
      expiresAt: lock.expiresAt
    });
    
  } catch (error) {
    console.error("Lock seats error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const confirmSelfBooking = async (req, res) => {
  try {
    const { tempBusId, lockId, paymentIntentId, passengerName, gender, phone, cnic } = req.body;
    const userId = req.user._id;
    
    const lock = await SeatLock.findById(lockId);
    if (!lock || lock.userId.toString() !== userId.toString() || lock.expiresAt < new Date()) {
      return res.status(410).json({ success: false, message: "Lock expired. Please reselect seats." });
    }
    
    const tempBus = await TemporaryBus.findOne({ _id: tempBusId, createdBy: userId, isActive: true });
    if (!tempBus) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    
    tempBus.bookedSeats.push(...lock.seatNumbers);
    await tempBus.save();
    
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
      bus: null,
      selectedSeats: lock.seatNumbers,
      passengerName,
      gender,
      phone,
      cnic,
      paymentMethod: "Stripe",
      paymentNumber: paymentIntentId,
      paymentStatus: "Paid",
      bookingStatus: "Pending",
      fromCity: tempBus.fromCity,
      date: tempBus.date,          
  departureTime: tempBus.departureTime, 
      toCity: tempBus.toCity,
      price: tempBus.price
    });

     try {
      const user = await User.findById(userId);
      if (user?.email) {
        await sendBookingEmail(user.email, {
          bookingId: booking.bookingId,
          passengerName,
          selectedSeats: lock.seatNumbers,
          fromCity: tempBus.fromCity,
          toCity: tempBus.toCity,
          date: tempBus.date,
          departureTime: tempBus.departureTime,
          totalAmount: (tempBus.price * lock.seatNumbers.length + 50).toLocaleString(),
        });
      }
    } catch (emailErr) {
      console.error("Email failed (booking still saved):", emailErr.message);
    }

    try {
      await sendBookingSMS(phone, {
        bookingId: booking.bookingId,
        passengerName,
        selectedSeats: lock.seatNumbers,
        fromCity: tempBus.fromCity,
        toCity: tempBus.toCity,
        date: tempBus.date,
        departureTime: tempBus.departureTime,
        totalAmount: (tempBus.price * lock.seatNumbers.length + 50).toLocaleString(),
      });
    } catch (smsErr) {
      console.error("SMS failed (booking still saved):", smsErr.message);
    }
    
    tempBus.bookingId = booking._id;
    tempBus.isActive = false;
    await tempBus.save();
    
    await SeatLock.findByIdAndDelete(lockId);
    
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "-password");
    
    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully!",
      booking: populatedBooking,
      tempBus
    });
    
  } catch (error) {
    console.error("Confirm self booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSelfBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const tempBuses = await TemporaryBus.find({ 
      createdBy: userId, 
      bookingId: { $ne: null },
      isActive: false
    }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      bookings: tempBuses
    });
    
  } catch (error) {
    console.error("Get self bookings error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};