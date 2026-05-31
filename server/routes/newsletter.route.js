import express from 'express'
import { addEmail, deleteNewsLetter, getEmails } from '../controllers/newsletter.controller.js'
import { ownerRoute } from '../middleware/ownerRoute.js';

const newsletterRouter = express.Router()

newsletterRouter.post("/send-email", addEmail);
newsletterRouter.get("/get-email", getEmails);
newsletterRouter.post("/delete-email/:id", ownerRoute ,deleteNewsLetter);

export default newsletterRouter