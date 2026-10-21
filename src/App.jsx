import { useState } from 'react'

const emptyForm = { username: '', email: '', password: '' }

function App() {
  const [form, setForm] = useState(emptyForm)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setForm(emptyForm)
  }

  const handleCancel = () => {
    setForm(emptyForm)
  }

  return (
    <main>
      <h1>Create user</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          User name
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <div className="buttons">
          <button type="submit">Create</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}

export default App
