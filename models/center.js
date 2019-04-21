const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const centerSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    operatorName: {
        type: String,
        required: true
    },
    operatorDes: {
        type: String,
        required: true
    },
    operatorNumber : {
        type: String,
        required: true
    },
    address : {
        type :String,
        required : false
    },
    account : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    facebook : {
        type: String,
        required : false
    },
    description : {
        type : String,
        required : false
    },
    odescription : {
        type : String,
        required : false
    },
    logo: {
        type: String,
        required: false
    },
    coverImage: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
}, {
        timestamps: true
    });
module.exports = mongoose.model('center', centerSchema);
