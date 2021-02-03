var express = require('express');
var router = express.Router();
const checkAuth= require('../middleware/check-auth');
const passModel = require('../models/password');
const catModel = require('../models/category');
const joinController = require('../controller/join_controller');

router.get('/passwordDetail',checkAuth, joinController.get_all_passwords);

router.get('/passwordDetail/:page',checkAuth, joinController.get_all_passwords_pagination);

module.exports = router;