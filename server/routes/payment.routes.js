import express from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-intent", protectedRoute, createPaymentIntent);

export default paymentRouter;