const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volInfoSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    address : { 
        type : String,
    },
    number: {
        type : String,
        required : true
    },
    longitude : {
        type : Number,
        required : true
    },
    latitude : {
        type : Number,
        required : true
    },
    bloodGroup : {
        type : String,
        default : ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
}, {
    timestamps : true
});
 module.exports = mongoose.model('volInfo',volInfoSchema);