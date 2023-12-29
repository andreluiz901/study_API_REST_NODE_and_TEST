import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", (table) => {
    table.renameColumn("ammount", "amount");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("transactions", (table) => {
    table.renameColumn("amount", "ammount");
  });
}
