import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  lockSeats,
  confirmBooking,
  getAvailableSeats
} from "../controllers/booking.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { ownerRoute } from "../middleware/ownerRoute.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", protectedRoute, createBooking);
bookingRouter.get("/my-bookings", protectedRoute, getUserBookings);
bookingRouter.get("/all", ownerRoute, getAllBookings);
bookingRouter.put("/update/:id", ownerRoute, updateBookingStatus);
bookingRouter.delete("/delete/:id", ownerRoute, deleteBooking);

bookingRouter.post("/lock-seats", protectedRoute, lockSeats);
bookingRouter.post("/confirm-booking", protectedRoute, confirmBooking);
bookingRouter.get("/available-seats/:busId", protectedRoute, getAvailableSeats);

export default bookingRouter;