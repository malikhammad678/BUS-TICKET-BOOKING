import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    message:{
        type:String,
        required:true
    }

},{timestamps:true})

const Contact = mongoose.model('contact', contactSchema)

export default Contact