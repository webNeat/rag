import os from 'os'
import path from 'path'
import { mkdir } from 'fs/promises'
import { Database } from 'bun:sqlite'
import * as config from './config'

const db_schema = /* sql */ `
CREATE TABLE documentations (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE,
  repo_url TEXT,
  subdir TEXT,
  branch TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE files (
  id INTEGER PRIMARY KEY,
  documentation_id INTEGER,
  path TEXT,
  hash TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE chunks (
  id INTEGER PRIMARY KEY,
  file_id INTEGER,
  index INTEGER,
  metadata TEXT,
  content TEXT,
  embedding BLOB,
  created_at INTEGER,
  updated_at INTEGER
);
`

export async function exists() {
  const { database_path } = await config.get()
  return Bun.file(database_path).exists()
}

export async function create() {
  const { database_path } = await config.get()
  await mkdir(path.dirname(database_path), { recursive: true })
  const db = new Database(database_path)
  db.transaction(() => {
    db.prepare(db_schema).run()
  })()
}
