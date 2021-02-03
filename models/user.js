const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:true,
        index : {
            unique : true
        }
    },

    email : {
        type : String,
        required : true,
        index : {
            unique : true
        }
    },

    password : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        default : Date.now
    },

    status : {
        type: Number,
        default : 0
    }
});

const userModel = mongoose.model('users',userSchema);
module.exports = userModel;

