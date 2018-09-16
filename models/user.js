 var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({

    firstname: {
        type: String,
        default : "",
        unique: false

    },
    lastname: {

        type: String,
        default : "",
        unique: false

    },
    userId : {
        type :String,
    },
    admin: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User',User);