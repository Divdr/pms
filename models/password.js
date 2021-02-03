const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var passwordSchema = new mongoose.Schema({
    passCategoryName : {
        type:String,
        required:true
    },
    projectName : {
        type:String,
        required:true
    },
    password_detail : {
        type : String,
        required : true
    },
    status : {
        type : Number,
        default : 0
    },
    date : {
        type : Date,
        default : Date.now
    }
});

passwordSchema.plugin(mongoosePaginate);
const passModel = mongoose.model('password',passwordSchema);
module.exports = passModel;

