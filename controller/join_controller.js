const passModel = require('../models/password');
const catModel = require('../models/category');

if ( typeof localStorage === "undefined" || localStorage === null){
    var localStorage = require('node-localstorage').LocalStorage;
    localStorage = new localStorage('./scratch');
}

const password_details = passModel.find({});
const loginUser = localStorage.getItem('loginUser');
const getPassCategories = catModel.find({});

//pagination using mongoose-paginate plugin

exports.get_all_passwords = function(req, res, next) {

    passModel.aggregate([
        {
            $lookup:{
                from : "categories",
                localField : "passCategoryName",
                foreignField : "categoryName",
                as : "pass_cat_details"
            }
        },{
            $unwind : "$pass_cat_details"
        }
    ]).exec((err,doc)=>{
        if(!err){
            console.log(doc);
            res.send(doc);
        }
    });
}

//without plugin pagination

exports.get_all_passwords_pagination = function(req, res, next) {
    var perPage = 3;
    var page = req.params.page || 1;

    password_details
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err,doc)=>{
            if(!err){
                passModel.countDocuments({}).exec((err,count)=>{
                    res.render('password/password_details', 
                        {   
                            title: 'Password Management System',
                            loginUser:loginUser,
                            records : doc,
                            current : page ,
                            pages : Math.ceil(count/perPage) 
                        }
                    );
                });
            }
        }
    );
}
