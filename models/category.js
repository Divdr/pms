const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    categoryName : {
        type:String,
        required:true,
        index : {
            unique : true
        }
    },

    status : {
        type : Number,
        default : 0
    }
});

const userModel = mongoose.model('category',userSchema);
module.exports = userModel;

