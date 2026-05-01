import express from 'express'
import { deleteUser, getAllUsers, getBuses, getMe, login, signup, toggleBlockUser } from '../controllers/user.controller.js'
import { ownerRoute } from '../middleware/ownerRoute.js'
import { protectedRoute } from '../middleware/protectedRoute.js'

const userRouter = express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.get("/me", protectedRoute, getMe)  

userRouter.get("/all", ownerRoute, getAllUsers);
userRouter.put("/toggle-block/:id", ownerRoute, toggleBlockUser);
userRouter.delete("/delete/:id", ownerRoute, deleteUser);
userRouter.get("/all", protectedRoute , getBuses);

export default userRouter 