import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from "../controllers/booking.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { ownerRoute } from "../middleware/ownerRoute.js";

const bookingRouter = express.Router();


bookingRouter.post("/create", protectedRoute, createBooking);
bookingRouter.get("/my-bookings", protectedRoute, getUserBookings);

bookingRouter.get("/all", ownerRoute, getAllBookings);
bookingRouter.put("/update/:id", ownerRoute, updateBookingStatus);
bookingRouter.delete("/delete/:id", ownerRoute, deleteBooking);

export default bookingRouter;