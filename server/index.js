import { randomBytes, scryptSync } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import express from 'express'

const db = new DatabaseSync('users.db')
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL
  )
`)

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

const app = express()
app.use(express.json())

app.get('/api/users', (req, res) => {
  res.json(db.prepare('SELECT id, name, email FROM users ORDER BY id').all())
})

app.post('/api/users', (req, res) => {
  const { name = '', email = '', password = '' } = req.body
  const { lastInsertRowid } = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, hashPassword(password))
  res.status(201).json({ id: Number(lastInsertRowid), name, email })
})

app.delete('/api/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

app.listen(3001, () => console.log('API listening on http://localhost:3001'))
