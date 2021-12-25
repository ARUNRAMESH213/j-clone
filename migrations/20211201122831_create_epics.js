exports.up = function (knex) {
  return knex.schema.createTable("epics", function (table) {
    table.increments();
    table.string("name").notNullable().unique();
    table.string("file_name")
    
    table.timestamps();

  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("epics");
};
