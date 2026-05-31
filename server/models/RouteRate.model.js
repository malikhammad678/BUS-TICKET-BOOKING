import mongoose from "mongoose";

const routeRateSchema = new mongoose.Schema({
  fromCity: { type: String, required: true, trim: true },
  toCity:   { type: String, required: true, trim: true },
  distanceKm: { type: Number, required: true },
  rates: {
    AC:      { type: Number, default: 15 },
    "Non-AC": { type: Number, default: 10 },
    Sleeper: { type: Number, default: 20 },
    Mini:    { type: Number, default: 8  }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

routeRateSchema.index({ fromCity: 1, toCity: 1 }, { unique: true });

export default mongoose.model("RouteRate", routeRateSchema);