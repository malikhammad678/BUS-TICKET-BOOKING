import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Bus from "../models/bus.model.js";
import SeatLock from "../models/SeatLock.model.js";
import BusSchedule from "../models/BusSchedule.model.js";
import { sendBookingEmail, sendStatusEmail } from "../utils/sendEmail.js";
import { sendBookingSMS, sendStatusSMS } from "../utils/sendSMS.js";

const generateBookingId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BK";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const lockSeats = async (req, res) => {
  try {
    const { busId, date, seatNumbers } = req.body;
    const userId = req.user._id;

    if (!busId || !date || !seatNumbers?.length) {
      return res.status(400).json({ success: false, message: "Bus ID, date and seats are required" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const schedule = await BusSchedule.findOne({ busId, date });
    if (schedule) {
      const alreadyBooked = seatNumbers.some(seat => schedule.bookedSeats.includes(seat));
      if (alreadyBooked) {
        return res.status(409).json({ success: false, message: "Some seats are already booked" });
      }
    }

    const existingLock = await SeatLock.findOne({
      busId,
      date,
      seatNumbers: { $in: seatNumbers },
      expiresAt: { $gt: new Date() },
      userId: { $ne: userId }
    });

    if (existingLock) {
      return res.status(409).json({ 
        success: false, 
        message: `Seat ${existingLock.seatNumbers[0]} is being booked by another user` 
      });
    }

    await SeatLock.deleteMany({ busId, date, userId });

    const lock = await SeatLock.create({
      busId,
      date,
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

export const confirmBooking = async (req, res) => {
  try {
    const { lockId, paymentIntentId, passengerName, gender, phone, cnic } = req.body;
    const userId = req.user._id;

    if (!lockId || !paymentIntentId || !passengerName || !gender || !phone || !cnic) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const lock = await SeatLock.findById(lockId);
    if (!lock) {
      return res.status(404).json({ success: false, message: "Lock not found or expired" });
    }

    if (lock.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (lock.expiresAt < new Date()) {
      return res.status(410).json({ success: false, message: "Lock expired. Please reselect seats." });
    }

    const bus = await Bus.findById(lock.busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    let schedule = await BusSchedule.findOne({ busId: lock.busId, date: lock.date });
    if (!schedule) {
      schedule = await BusSchedule.create({
        busId: lock.busId,
        date: lock.date,
        totalSeats: 40,
        bookedSeats: []
      });
    }

    schedule.bookedSeats.push(...lock.seatNumbers);
    await schedule.save();

    
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
  bus: lock.busId,
  selectedSeats: lock.seatNumbers,
  passengerName,
  gender,
  phone,
  cnic,
  paymentMethod: "Stripe",
  paymentNumber: paymentIntentId,
  paymentStatus: "Paid",
  bookingStatus: "Pending"  
});


 try {
      const user = await User.findById(userId);
      if (user?.email) {
        await sendBookingEmail(user.email, {
          bookingId: booking.bookingId,
          passengerName,
          selectedSeats: lock.seatNumbers,
          fromCity: bus.fromCity,
          toCity: bus.toCity,
          date: lock.date,
          departureTime: bus.departureTime,
          totalAmount: (bus.price * lock.seatNumbers.length + 50).toLocaleString(),
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
        fromCity: bus.fromCity,
        toCity: bus.toCity,
        date: lock.date,
        departureTime: bus.departureTime,
        totalAmount: (bus.price * lock.seatNumbers.length + 50).toLocaleString(),
      });
    } catch (smsErr) {
      console.error("SMS failed (booking still saved):", smsErr.message);
    }

    await SeatLock.findByIdAndDelete(lockId);

    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("bus")
      .populate("user", "-password");

    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: populatedBooking
    });

  } catch (error) {
    console.error("Confirm booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAvailableSeats = async (req, res) => {
  try {
    const { busId } = req.params;
    const { date } = req.query;

    if (!busId || !date) {
      return res.status(400).json({ success: false, message: "Bus ID and date are required" });
    }

    const schedule = await BusSchedule.findOne({ busId, date });
    const bookedSeats = schedule ? schedule.bookedSeats : [];

    const activeLocks = await SeatLock.find({
      busId,
      date,
      expiresAt: { $gt: new Date() }
    });
    
    const lockedSeats = [...new Set(activeLocks.flatMap(lock => lock.seatNumbers))];

    const totalSeats = 40;
    const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
    
    const availableSeats = allSeats.filter(
      seat => !bookedSeats.includes(seat) && !lockedSeats.includes(seat)
    );

    return res.status(200).json({
      success: true,
      totalSeats,
      bookedSeats,
      lockedSeats,
      availableSeats,
      seatLayout: "2x2"
    });

  } catch (error) {
    console.error("Get available seats error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
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
      selectedSeats: [],
      passengerName,
      gender,
      phone,
      cnic,
      paymentMethod,
      paymentNumber,
      paymentStatus: "Paid",
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

    const bookingRaw = await Booking.findById(req.params.id);
    if (!bookingRaw) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const phone = bookingRaw.phone;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    ).populate("bus").populate("user", "-password");

    if (bookingStatus === "confirmed" || bookingStatus === "cancelled") {
      
      const fromCity = booking.fromCity || booking.bus?.fromCity || "—";
      const toCity = booking.toCity || booking.bus?.toCity || "—";
      const date = booking.date || booking.bus?.date || "—";
      const departureTime = booking.departureTime || booking.bus?.departureTime || "—";
      const price = booking.price || booking.bus?.price || 0;
      
      const selectedSeats = Array.isArray(booking.selectedSeats) && booking.selectedSeats.length > 0
        ? booking.selectedSeats
        : ["N/A"];
      
      const totalAmount = (price * (booking.selectedSeats?.length || 1) + 50).toLocaleString();

      const notifData = {
        status: bookingStatus,
        bookingId: booking.bookingId,
        passengerName: booking.passengerName,
        selectedSeats,   
        fromCity,
        toCity,
        date,
        departureTime,
        totalAmount,
      };

      try {
        if (booking.user?.email) {
          await sendStatusEmail(booking.user.email, notifData);
        }
      } catch (e) {
        console.error("Status email failed:", e.message);
      }

      try {
        if (phone) {
          console.log("Sending SMS to:", phone); 
          await sendStatusSMS(phone, notifData);
        } else {
          console.warn("No phone number found for booking:", booking.bookingId);
        }
      } catch (e) {
        console.error("Status SMS failed:", e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      booking
    });

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