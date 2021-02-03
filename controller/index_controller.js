const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

if ( typeof localStorage === "undefined" || localStorage === null){
    var localStorage = require('node-localstorage').LocalStorage;
    localStorage = new localStorage('./scratch');
}
  
const loginUser = localStorage.getItem('loginUser');

exports.Index_Page = function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if(loginUser){
        res.redirect('/dashboard');
    }else{
        res.render('index', { title: 'Password Management System',msg: '',errors:'' });
    }
}

exports.User_login = function(req, res, next) {

    var errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('index',{title : "Password Management System",errors:errors.mapped(),msg:'',user : req.body});
    }else{

        var username = req.body.uname;
        var password = req.body.password;

        var checkUser= userModel.findOne({
            username : username
        });

        checkUser.exec((err,doc)=>{
            if(!doc){
                res.render('index',{title : "Password Management System",msg: 'Auth Failed',errors:''});
            }else{
                var getUserID = doc._id;
                var hashPassword = doc.password;
            if(bcrypt.compareSync(password,hashPassword)){
                var token = jwt.sign({
                userID : getUserID
                },'loginToken');
                console.log("UserToken ::"+token);
                localStorage.setItem('userToken',token);
                localStorage.setItem('loginUser',username);
                res.redirect('/dashboard');
            }else{
                res.render('index',{title : "Password Management System",msg: 'Auth Failed',errors:''});
            }
            }
        });
    }

}

exports.signup_Form = function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if(loginUser){
        res.redirect('/dashboard');
    }else{
        res.render('signup', { title: 'Password Management System',errors: '', user: req.body });
    }
}

exports.user_Signup = function(req, res, next) {

    var username  = req.body.uname;
    var email = req.body.email;
    var password = req.body.password;
    var confpassword = req.body.confpassword;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('signup',{title : "Password Management System",errors:errors.mapped(),user : req.body});
    }else{
        confpassword = bcrypt.hashSync(password,10);

        var user = new userModel({
        username : username,
        email : email,
        password : confpassword
        });

        user.save((err,doc)=>{
        if(err) throw err
        else{
            console.log(doc);
            res.redirect('/');
        }
        });
    }
}

exports.user_Dashboard = (req,res,next)=>{
    var loginUser = localStorage.getItem('loginUser');
    res.render('dashboard',{title : "Password Management System",msg: '',loginUser:loginUser});
}

exports.logout_User = (req,res,next)=>{
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/');
}