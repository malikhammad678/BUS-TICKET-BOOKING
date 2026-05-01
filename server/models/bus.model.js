import mongoose from "mongoose";

const busSchema = new mongoose.Schema({

  busName: {
    type: String,
    required: true,
    trim: true
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
  price: {
    type: Number,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  busType: {
    type: String,
    enum: ["AC", "Non-AC", "Sleeper", "Mini"],
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  bestSeller: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

const Bus = mongoose.models.Bus || mongoose.model("Bus", busSchema)

export default Bus;