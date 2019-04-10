const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otherSchema = new Schema({
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
    foodType: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
    },
    latitude: {
        type: Number
    },
    volId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vol'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
        timestamps: true    
});
module.exports = mongoose.model('other', otherSchema);
