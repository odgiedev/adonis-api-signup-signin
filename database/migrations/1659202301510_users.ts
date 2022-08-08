import BaseSchema from '@ioc:Adonis/Lucid/Schema'

import { v4 as uuid } from 'uuid'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').defaultTo(uuid());
      table.string('username')
      table.string('email')
      table.string('password')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
