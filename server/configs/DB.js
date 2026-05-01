import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        const response = await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 5000,  
            family: 4,                        
        });
        console.log(`MongoDB connected: ${response.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};