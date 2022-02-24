const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone : {type : Number , required : true},
    otp : {type : String },
    otp_verified : {type : Boolean},
    city : {type : String} ,
    state : {type : String},
    reff_by : [],
    pin_code : {type : String},
    address : {type : String},
    role: { type: String, default: 'customer' }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)