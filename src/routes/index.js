var express = require('express');
var router        = express.Router();

router.route('/')
    .get(function(req, res) {
        console.log('get on index', req.params)

        const opcoes = [
            {
                verb: 'POST',
                path: 'lights',
                params: {
                    light_ender: "integer"
                }
            }
        ]

        return res.status(301).json(opcoes)
    });
;

module.exports = router;