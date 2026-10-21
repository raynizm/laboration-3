import { fileURLToPath } from 'node:url'
import express from 'express'
import usersRouter from './usersRouter.js'

const DEFAULT_PORT = 3001
const FRONTEND_DIR = fileURLToPath(new URL('../dist', import.meta.url))

const app = express()
app.use(express.json())
app.use('/api/users', usersRouter)
// Serves the built frontend (`npm run build`) in production.
app.use(express.static(FRONTEND_DIR))

// Express recognises error handlers by their four parameters.
app.use((error, req, res, _next) => {
  const status = error.status ?? 500
  if (status >= 500) console.error(error)
  res
    .status(status)
    .json({ error: status >= 500 ? 'Internal server error' : error.message })
})

const port = process.env.PORT ?? DEFAULT_PORT
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
