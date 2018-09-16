const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;



const dishSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    foodType: {
        type: Number,
        default: 0
    },
    foodVegType: {
        type : Number,
        default: 0
    },
    nearDlvry: {
        type: Number,
        default: 0
    },
    packedParcel: {
        type: Number,
        default: 0
    },
    sitEat: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
    },
    latitude: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Res'
    }

}, {
        timestamps: true
    });
module.exports = mongoose.model('Dish', dishSchema);
