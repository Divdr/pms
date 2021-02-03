const passModel = require('../models/password');
const catModel = require('../models/category');
const { Result } = require('express-validator');


if ( typeof localStorage === "undefined" || localStorage === null){
    var localStorage = require('node-localstorage').LocalStorage;
    localStorage = new localStorage('./scratch');
}

const password_details = passModel.find({});
const loginUser = localStorage.getItem('loginUser');
const getPassCategories = catModel.find({});


//pagination using mongoose-paginate plugin

exports.get_all_passwords = function(req, res, next) {

    var options = {
        offset : 1,
        limit : 3
    };

    passModel.paginate({},options).then((result)=>{
        console.log(result);
        res.render('password/password_details', 
            {   
                title: 'Password Management System',
                loginUser:loginUser,
                records : result.docs,
                current : result.offset,
                pages : Math.ceil(result.total/result.limit)
            }
        );
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

exports.add_password_form = function(req, res, next) {
    getPassCategories.exec((err,doc)=>{
        if(!err){
            res.render('password/add-new-password', { title: 'Password Management System' ,loginUser:loginUser,catRecords:doc });
        }
    });
}

exports.add_new_password = (req,res,next)=>{
    var pcategory = req.body.password_category;
    var pdetail = req.body.password_detail;
    var pname = req.body.project_name;

    var passDetail = new passModel({
        passCategoryName : pcategory,
        password_detail : pdetail,
        projectName : pname
    });

    console.log(passDetail);

    passDetail.save((err,doc)=>{
        if(err){
            console.log(err);
            res.redirect('/password/passwordDetail');
        }else{
            console.log("record Inserted "+doc);
            res.redirect('/password/passwordDetail');
        }
        
    })
}