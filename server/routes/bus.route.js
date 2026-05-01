import express from "express";
import { addBus, getAllBuses, deleteBus } from "../controllers/bus.controller.js"
import upload from "../configs/multer.js";
import { ownerRoute } from "../middleware/ownerRoute.js";

const busRouter = express.Router();

busRouter.post("/add", ownerRoute, upload.single("image") , addBus);
busRouter.get("/all", getAllBuses);
busRouter.delete("/delete/:id", ownerRoute, deleteBus);

export default busRouter;