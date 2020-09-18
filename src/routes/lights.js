const express = require('express');
const lightsController = require('../controller/lights');

const router         = express.Router();

router.post('/', lightsController.switchState);

module.exports = router;