import express from 'express'
import { deleteMessage, getMessages, sendMessage } from '../controllers/contact.controller.js'
import { ownerRoute } from '../middleware/ownerRoute.js'

const contactRouter = express.Router()

contactRouter.post("/sendMessage", sendMessage)
contactRouter.delete("/delete/:id", ownerRoute, deleteMessage )
contactRouter.get("/get", ownerRoute, getMessages)

export default contactRouter