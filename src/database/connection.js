const knex       = require('knex');
const configuration = require('../../knexfile.js');

const conn = knex(configuration.development);

module.exports = conn;