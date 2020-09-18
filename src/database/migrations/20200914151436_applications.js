
exports.up = function(knex) {
  return knex.schema
    .createTable('application', table => {
      table.increments('id').primary();

      table.string('secret', 256).notNullable();
      table.string('name', 256).notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('application');
};
