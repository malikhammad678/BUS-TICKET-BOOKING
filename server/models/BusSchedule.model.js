import mongoose from "mongoose";

const busScheduleSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    default: 40
  },
  bookedSeats: [{
    type: Number,
    default: []
  }],
  seatLayout: {
    type: String,
    enum: ["2x2", "2x1", "1x2"],
    default: "2x2"
  }
}, { timestamps: true });

busScheduleSchema.index({ busId: 1, date: 1 }, { unique: true });

const BusSchedule = mongoose.models.BusSchedule || mongoose.model("BusSchedule", busScheduleSchema);
export default BusSchedule;