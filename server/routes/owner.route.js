import express from "express";
import { getAllBookings, ownerLogin, getAdminBuses, getAdminUsers, getRouteRates,
  addRouteRate,
  updateRouteRate,
  deleteRouteRate,
  calculateRoutePrice } from "../controllers/owner.controller.js";
import { ownerRoute } from "../middleware/ownerRoute.js";
import { getTotalBookings, getTotalBuses, getTotalUsers } from "../controllers/user.controller.js";

const ownerRouter = express.Router();

ownerRouter.post("/login", ownerLogin);
ownerRouter.get("/getBuses", ownerRoute, getTotalBuses )
ownerRouter.get("/getUsers", ownerRoute, getTotalUsers )
ownerRouter.get("/getBookings", ownerRoute, getTotalBookings )
ownerRouter.get("/get-admin-bookings", ownerRoute, getAllBookings )
ownerRouter.get("/get-admin-buses", ownerRoute, getAdminBuses )
ownerRouter.get("/get-admin-users", ownerRoute, getAdminUsers )
ownerRouter.get("/route-rates",          ownerRoute, getRouteRates);
ownerRouter.post("/route-rates",         ownerRoute, addRouteRate);
ownerRouter.put("/route-rates/:id",      ownerRoute, updateRouteRate);
ownerRouter.delete("/route-rates/:id",   ownerRoute, deleteRouteRate);
ownerRouter.get("/calculate-price", calculateRoutePrice);
export default ownerRouter;