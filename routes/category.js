var express = require('express');
var catModel = require('../models/category');
var router = express.Router();
const checkAuth= require('../middleware/check-auth');
const {check, validationResult } = require('express-validator');

const catController = require('../controller/category_controller');

router.get('/passwordCategory',checkAuth, catController.get_all_categories);

router.get('/add-new-category',checkAuth,catController.add_cat_form);

router.post('/add-new-category',[
    check('cname','Please Enter Category Name').isLength({min:3})
    .custom((value)=>{
      var query = catModel.find({categoryName : value})
      return query.exec().then(cat=>{
        if(cat.length > 0){
          throw new Error('Category Already Exists');
        }
      });
    })
],catController.add_Category);

router.get('/update/:catId',catController.get_data_for_update);

router.get('/remove/:catId',catController.remove_Category);



module.exports = router;
