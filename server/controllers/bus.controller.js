import cloudinary from "../configs/cloudinary.js";
import Bus from "../models/bus.model.js";

export const addBus = async (req, res) => {
  try {
    const { busName, fromCity, toCity, price, departureTime, date, duration, busType, bestSeller } = req.body;

    const filePath = req.file

    if (!busName || !fromCity || !toCity || !price || !departureTime || !date || !duration || !busType || !filePath) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let imageUrl = ""

    if (filePath) {
      const base64 = filePath.buffer.toString('base64')
      const dataUri = `data:${filePath.mimetype};base64,${base64}`

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "bus-tickets"
      })
      imageUrl = result.secure_url
    }

    const bus = await Bus.create({
      busName, fromCity, toCity,
      price: Number(price),
      departureTime, date, duration,
      busType, image: imageUrl,
      bestSeller: bestSeller === "true" || bestSeller === true
    })

    return res.status(201).json({ success: true, message: "Bus added successfully", bus });

  } catch (error) {
    console.error("Add bus error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, buses });

  } catch (error) { 
    console.error("Get buses error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    return res.status(200).json({ success: true, message: "Bus deleted successfully" });

  } catch (error) {
    console.error("Delete bus error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};