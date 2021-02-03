var express = require('express');
var router = express.Router();
const checkAuth= require('../middleware/check-auth');
const passModel = require('../models/password');
const catModel = require('../models/category');

const passController = require('../controller/password_controller');

router.get('/passwordDetail',checkAuth, passController.get_all_passwords);

router.get('/passwordDetail/:page',checkAuth, passController.get_all_passwords_pagination);

router.get('/add-new-password',checkAuth, passController.add_password_form);

router.post('/add-new-password',checkAuth, passController.add_new_password);

module.exports = router;
