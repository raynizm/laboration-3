import { Router } from 'express'
import { SecureHasher } from 'laboration-2'
import { deleteUser, insertUser, listUsers } from './database.js'

const router = Router()
const hasher = new SecureHasher()

router.get('/', (req, res) => {
  res.json(listUsers())
})

router.post('/', async (req, res) => {
  const { name = '', email = '', password = '' } = req.body

  if (typeof password !== 'string' || password === '') {
    return res.status(400).json({ error: 'Password is required' })
  }

  const passwordRecord = await hasher.hashWithSalt(password)
  const id = insertUser({ name, email, passwordRecord })
  res.status(201).json({ id, name, email })
})

router.delete('/:id', (req, res) => {
  deleteUser(req.params.id)
  res.status(204).end()
})

export default router
