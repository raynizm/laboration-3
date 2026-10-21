import express from 'express'
import usersRouter from './usersRouter.js'

const DEFAULT_PORT = 3001

const app = express()
app.use(express.json())
app.use('/api/users', usersRouter)

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
