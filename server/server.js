import express from 'express'
import 'dotenv/config'
import { connectDatabase } from './configs/DB.js'
import userRouter from './routes/user.route.js'
import busRouter from './routes/bus.route.js'
import ownerRouter from './routes/owner.route.js'
import bookingRouter from './routes/booking.route.js'
import paymentRouter from './routes/payment.routes.js'
import cors from 'cors'
import contactRouter from './routes/contact.route.js'
import selfBookingRouter from "./routes/selfBooking.routes.js";
import newsletterRouter from './routes/newsletter.route.js'

const app = express()
app.use(express.json())

app.use(cors())


const PORT = process.env.PORT || 3000

app.use("/api/users", userRouter);
app.use("/api/bus", busRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/contact", contactRouter)
app.use("/api/self-booking", selfBookingRouter);
app.use("/api/newsletter", newsletterRouter);

app.get("/", (req,res) => {
    res.json({ message:`Server is running on ${PORT}` })
})


app.listen(PORT, () => {
    connectDatabase()
    console.log(`APP is running on ${PORT}`)
})