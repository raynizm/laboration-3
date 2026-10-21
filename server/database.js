import { DatabaseSync } from 'node:sqlite'

const DEFAULT_DB_FILE = 'users.db'

const db = new DatabaseSync(process.env.DB_FILE ?? DEFAULT_DB_FILE)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_algorithm TEXT NOT NULL,
    password_iterations INTEGER NOT NULL
  )
`)

export function listUsers() {
  return db.prepare('SELECT id, name, email FROM users ORDER BY id').all()
}

/**
 * @param {Object} user
 * @param {{ hash: string, salt: string, algorithm: string, iterations: number }} user.passwordRecord
 *   The record returned by SecureHasher.hashWithSalt().
 * @returns {number} The id of the new user.
 */
export function insertUser({ name, email, passwordRecord }) {
  const { hash, salt, algorithm, iterations } = passwordRecord
  const { lastInsertRowid } = db
    .prepare(
      `INSERT INTO users
        (name, email, password_hash, password_salt, password_algorithm, password_iterations)
        VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(name, email, hash, salt, algorithm, iterations)
  return Number(lastInsertRowid)
}

export function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
}
