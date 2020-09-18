const express      = require('express');
const jwt          = require('jsonwebtoken');
const fs           = require('fs');

const privateKey   = fs.readFileSync('../private.key');

const utils = {

    sendResponse: (res, result) => res.json(result),

    sendErrorResponse: (res, err, msg) => {

        if (!err) {
            console.trace();
        }

        const error = !!msg ?msg: !!err && !!err.message ? err.message : err || 'Ocorreu um erro inesperado';

        res.status(500).json({ error });
    },

    verifyAuthenticate: (req, res, next) => {

        // console.log('Time: ', Math.floor(Date.now() / 1000));

        let token = req.headers.bearer;

        if(!token) {
            return res.status(401).json({error: "Token não está presente, tente fazer login."});
        }

        // jwt.verify(token, privateKey, {
        //     maxAge: "30min"
        // }, function(err, decoded) {
        jwt.verify(token, privateKey, {}, 
        function(err, decoded) {

            if(err) return res.status(401).json({error: err.message});

            req.body.AUTH_UID      = decoded.uid;
            req.body.AUTH_APP_NAME = decoded.app_name;
            next();
        });
    }
}

module.exports = utils;