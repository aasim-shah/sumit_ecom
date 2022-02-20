const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productShema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    desc :{ type : String},
    price: { type: Number, required: true },
    size: { type: String }
})

module.exports = mongoose.model('Products', productShema)