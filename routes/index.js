var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const checkAuth= require('../middleware/check-auth');
const {check, validationResult } = require('express-validator');

const indexController = require('../controller/index_controller');

if ( typeof localStorage === "undefined" || localStorage === null){
  var localStorage = require('node-localstorage').LocalStorage;
  localStorage = new localStorage('./scratch');
}

/* GET home page. */
router.get('/', indexController.Index_Page);

router.post('/',[
  check('uname').isLength({min:1}).withMessage('Please Enter Username'),
  check('password').isLength({min:1}).withMessage('Please Enter Password')
], indexController.User_login);

router.get('/signup', indexController.signup_Form);

router.post('/signup',[
  check('uname').isLength({min:1}).withMessage('Please Enter Username'),
  check('uname').custom((value)=>{
    var query = userModel.find({username : value})
    return query.exec().then(user=>{
      if(user.length>0){
        throw new Error('Username Already exist');
      }
    })
  }),
  check('email')
    .isLength({min:1}).withMessage('Please Enter Email Address')
    .isEmail().withMessage('Please Enter Valid Email Address like xyz@gmail.com'),
  check('password').isLength({min:1}).withMessage('Please Enter Password'),
  check('confpassword').isLength({min:1}).withMessage('Please Enter Confirm Password'),
  check('confpassword').custom((value,{req,res})=>{
    if(value !== req.body.password){
      throw new Error('Password & confirm password did not match');
    }
  })
], indexController.user_Signup);

router.get('/dashboard',checkAuth,indexController.user_Dashboard);

router.get('/logout',indexController.logout_User);


module.exports = router;
