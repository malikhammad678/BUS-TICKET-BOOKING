import mongoose from "mongoose";

const temporaryBusSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fromCity: {
    type: String,
    required: true,
    trim: true
  },
  toCity: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: "2h 30m"
  },
  price: {
    type: Number,
    required: true
  },
  busName: {
    type: String,
    default: "Private Bus"
  },
  busType: {
    type: String,
    enum: ["AC", "Non-AC", "Sleeper", "Mini"],
    default: "AC"
  },
  totalSeats: {
    type: Number,
    default: 40
  },
  bookedSeats: [{
    type: Number,
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
}, { timestamps: true });

temporaryBusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TemporaryBus = mongoose.models.TemporaryBus || mongoose.model("TemporaryBus", temporaryBusSchema);
export default TemporaryBus;