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
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
        timestamps: true
    });
    const resSchema = new Schema({
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
        resType : {
            type : Number,
            default : 0
        },
        des : {
            type : String,
            default : ""
        },
        vegType  : {
            type : Number,
            default : 0
        },
        dishes : {
            type : [{type:mongoose.Schema.Types.ObjectId
            ,ref : 'Dish'}]      
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [commentSchema]        
    }, {
        timestamps: true
    });
module.exports = mongoose.model('Res', resSchema);
