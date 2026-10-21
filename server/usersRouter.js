import { Router } from 'express'
import { deleteUser, insertUser, listUsers } from './database.js'
import hashPassword from './passwordHash.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(listUsers())
})

router.post('/', (req, res) => {
  const { name = '', email = '', password = '' } = req.body
  const id = insertUser({ name, email, passwordHash: hashPassword(password) })
  res.status(201).json({ id, name, email })
})

router.delete('/:id', (req, res) => {
  deleteUser(req.params.id)
  res.status(204).end()
})

export default router
