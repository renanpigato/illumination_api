const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.seed = function(knex) {
  
  const secret = crypto.randomBytes(4).toString('HEX');
  
  // Deletes ALL existing entries
  return knex('application').del()
    .then(() => bcrypt.hash(secret, 10))
    .then((hash) => {
      
      return knex('application').insert([
        {
          id: 1,
          secret: hash,
          name: `admin-develop(${secret})`
        }
      ]);
    });
};
