const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
        timestamps: true
    });
    const volSchema = new Schema({
        name : {
            type : String,
            required : true
        },
        address : {
            type : String,
        },
        number : {
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [commentSchema]
        
    }, {
        timestamps: true
    });
module.exports = mongoose.model('Vol', volSchema);
