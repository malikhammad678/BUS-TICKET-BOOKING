import NewsLetter from "../models/newsletter.model.js";

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const addEmail = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!isValidEmail(content)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const existingEmail = await NewsLetter.findOne({ content });
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed!"
            });
        }

        await NewsLetter.create({ content });

        return res.status(201).json({
            success: true,
            message: "Subscribed successfully!"
        });

    } catch (error) {
        console.error("Newsletter error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getEmails = async (req, res) => {
    try {
        const emails = await NewsLetter.find({});
        return res.status(200).json({
            success: true,
            emails: emails
        });
    } catch (error) {
        console.error("Get emails error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteNewsLetter = async (req,res) => {
    try {
        const { id } = req.params
        await NewsLetter.findByIdAndDelete(id)
        await res.status(200).json({
            success:true,
            message:"Deleted!"
        })
    } catch (error) {
        onsole.error("Get emails error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}