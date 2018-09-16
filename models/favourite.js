const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Dishes = require('./dishes');


const favouriteSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    dishes : {
        type : [{type:mongoose.Schema.Types.ObjectId
        ,ref : 'Dish'}]      
    }

},{timestamps:true});


var Favourites = mongoose.model('Favourite',favouriteSchema);

module.exports = Favourites;

