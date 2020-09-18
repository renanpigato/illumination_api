const express = require('express');
const authController = require('../controller/auth');
const utils = require('../libs/utils');

const router         = express.Router();

router.post('/login', authController.logon);
router.get('/logout', utils.verifyAuthenticate, authController.logout);

module.exports = router;