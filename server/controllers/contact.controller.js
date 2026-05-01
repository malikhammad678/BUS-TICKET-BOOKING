import Contact from "../models/contact.model.js";

export const sendMessage = async (req,res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;
        if(!firstName || !lastName || !email || !message){
          return res.status(400).json({ success:false, message:'All fields are required!'})
        }
        const newMessage = await Contact.create({
            firstName,
            lastName,
            email,
            phone,
            message
        })
        res.status(201).json({success:true, message:"Message Send Successfully", newMessage})
    } catch (error) {   
        res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Contact.findByIdAndDelete(id)

        if (!deleted) {  
            return res.status(404).json({ success: false, message: "Message not found!" })
        }

        res.status(200).json({ success: true, message: "Message Deleted!" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 })
        res.status(200).json({ success: true, messages })
    } catch (error) {
        console.error("Get messages error:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}