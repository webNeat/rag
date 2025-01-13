import * as db from './db'

export async function init() {
  if (!(await db.exists())) {
    await db.create()
  }
}
