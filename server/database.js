import { DatabaseSync } from 'node:sqlite'

const DEFAULT_DB_FILE = 'users.db'

const db = new DatabaseSync(process.env.DB_FILE ?? DEFAULT_DB_FILE)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL
  )
`)

export function listUsers() {
  return db.prepare('SELECT id, name, email FROM users ORDER BY id').all()
}

/** @returns {number} The id of the new user. */
export function insertUser({ name, email, passwordHash }) {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, passwordHash)
  return Number(lastInsertRowid)
}

export function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
}
