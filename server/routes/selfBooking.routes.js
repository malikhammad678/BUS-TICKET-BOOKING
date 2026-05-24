import express from "express";
import {
  createTemporaryBus,
  getTemporaryBus,
  lockSeatsForTempBus,
  confirmSelfBooking,
  getSelfBookings
} from "../controllers/selfBooking.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const selfBookingRouter = express.Router();

selfBookingRouter.post("/create-trip", protectedRoute, createTemporaryBus);
selfBookingRouter.get("/trip/:id", protectedRoute, getTemporaryBus);
selfBookingRouter.post("/lock-seats", protectedRoute, lockSeatsForTempBus);
selfBookingRouter.post("/confirm-booking", protectedRoute, confirmSelfBooking);
selfBookingRouter.get("/my-trips", protectedRoute, getSelfBookings);

export default selfBookingRouter;