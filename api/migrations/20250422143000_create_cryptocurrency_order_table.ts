export function up(knex: any) {
  return knex.schema.createTable("cryptocurrency_order", function (table: any) {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.string("symbol", 20).notNullable();
    table.integer("target_price").notNullable();
    table.integer("volume").notNullable();
    table.tinyint("type").notNullable();
    table.tinyint("is_enabled").notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex: any) {
  return knex.schema.dropTable("cryptocurrency_order");
}
