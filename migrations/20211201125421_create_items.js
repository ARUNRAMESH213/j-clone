exports.up = function (knex) {
  return knex.schema.createTable("items", (t) => {
    t.increments();
    t.string("name").notNullable();
    t.timestamps();

    t.integer("category_id")
      .unsigned()
      .notNullable()
      .references("categories.id")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("items");
};
