const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({

    number: {
        type: String,
        required: false,
    },

    ifsc: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    bank: {
        type: String,
        required: false
    },
    googlepay : {
        type: String,
        required: false
    },
    phonepay : {
        type : String,
        required : false
    },
    paytm : {
        type : String,
        required : false
    }
}, {
        timestamps: false
    });
module.exports = mongoose.model('account', accountSchema);
