import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    default: null
  },
  selectedSeats: [{
    type: Number,
    default: []
  }],
  passengerName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cnic: {
    type: String,
    required: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentNumber: {
    type: String,
    required: true,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  },
  bookingStatus: {
    type: String,
    enum: ["Confirmed", "Pending", "Cancelled"],
    default: "Pending"
  },
  bookedOn: {
    type: Date,
    default: Date.now
  },
  // Self booking fields
  fromCity: {
    type: String,
    trim: true
  },
  toCity: {
    type: String,
    trim: true
  },
  price: {
    type: Number
  },
  date: { type: String },
departureTime: { type: String },
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;