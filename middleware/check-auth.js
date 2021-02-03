const jwt = require('jsonwebtoken');
if ( typeof localStorage === "undefined" || localStorage === null){
    var localStorage = require('node-localstorage').LocalStorage;
    localStorage = new localStorage('./scratch');
}

module.exports = (req,res,next)=>{
    var token = localStorage.getItem('userToken');
    try{
        var decode = jwt.verify(token,'loginToken');
        next();
    }catch(err){
        res.redirect('/');
    } 
}