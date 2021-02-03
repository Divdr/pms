const {check, validationResult } = require('express-validator');
const catModel = require('../models/category');

if ( typeof localStorage === "undefined" || localStorage === null){
    var localStorage = require('node-localstorage').LocalStorage;
    localStorage = new localStorage('./scratch');
}
  
const loginUser = localStorage.getItem('loginUser');

exports.get_all_categories = function(req, res, next) {
    const categories = catModel.find({});
    categories.exec((err,doc)=>{
        if(!err){
            res.render('category/password_category', { title: 'Password Management System',loginUser:loginUser, categories : doc});
        }else{
            throw err
        }
    });
}

exports.add_cat_form = function(req, res, next) {
    res.render('category/add_category', { title: 'Password Management System',loginUser:loginUser ,errors : '',category:req.body });
}

exports.add_Category = (req,res,next)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.render('category/add_category', { title: 'Password Management System',loginUser:loginUser ,category : req.body,errors:errors.mapped()});
    }else{
        var catName = req.body.cname;
    
        if(req.body._id== ''){ 
            var category = new catModel({
                categoryName : catName
            });
            category.save((err,doc)=>{
                if(err){
                    console.log(err);
                    res.redirect('/category/passwordCategory');
                }
                else{
                    console.log(doc);
                    res.redirect('/category/passwordCategory');
                }
            });
        }else{
            var catId = req.body._id;
            catModel.updateOne({_id : catId},{categoryName : catName},(err,doc)=>{
                if(!err){
                    console.log(doc);
                    res.redirect('/category/passwordCategory');
                }else{
                    console.log(err);
                    res.render('category/add_category', { title: 'Password Management System',loginUser:loginUser,errors:'' ,category : req.body});
                }
                    
            })
        }
    }
    
    
    
}

exports.remove_Category = (req,res,next)=>{
    var catId = req.params.catId;
    console.log(catId);

    catModel.findByIdAndDelete({_id: catId},(err,doc)=>{
        if(!err){
            res.redirect('/category/passwordCategory');
        }else{
            console.log(err);
            res.redirect('/category/passwordCategory');   
        }
    });
}

exports.get_data_for_update = (req,res,next)=>{
    var catId = req.params.catId;
    console.log("get Update data of :"+catId);
    catModel.findById({_id: catId},(err,doc)=>{
        if(!err){
            res.render('category/add_category', { title: 'Password Management System',loginUser:loginUser ,errors : '',category: {
                cname: doc.categoryName,
                _id : doc._id
            }});
        }else{
            console.log(err);
            res.redirect('/category/passwordCategory');
        }
    });
}