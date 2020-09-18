const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const utils = require('../libs/utils');
const conn = require('../database/connection');
const privateKey = fs.readFileSync('../private.key');

module.exports = {
  
  async logon (req, res, next) {
    console.log('post', req.body.id);

    const errorMsg = 'Não foi possível identificar a aplicação, verifique os dados informados';

    return await conn('application')
      .where('id', req.body.id)
      .select("*")
      .then(apps => {

        if (!apps || apps.length == 0) throw new Error(errorMsg);

        apps.forEach(app => {

          bcrypt.compare(req.body.secret, app.secret).then((result) => {

            if (result !== true) throw new Error(errorMsg);

            jwt.sign({
              uid: app.id,
              app_name: app.name
            }, privateKey, {
              expiresIn: '1h'
            }, (err, token) => {

              if (err) throw err;

              utils.sendResponse(res, { auth: true, token: token });
            });
          });
        })
      })
      .catch(err => utils.sendErrorResponse(res, err));
  },

  logout (req, res, next) {
    return utils.sendResponse(res, { auth: false, token: null });
  }
}