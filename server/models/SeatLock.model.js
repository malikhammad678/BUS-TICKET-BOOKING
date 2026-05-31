import mongoose from "mongoose";

const seatLockSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  seatNumbers: [{
    type: Number,
    required: true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  }
}, { timestamps: true });

seatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SeatLock = mongoose.models.SeatLock || mongoose.model("SeatLock", seatLockSchema);
export default SeatLock;