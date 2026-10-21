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
    <main className="container my-5" style={{ maxWidth: "24rem" }}>
      <h1>Create user</h1>
      <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
        <label className="form-label w-100">
          User name
          <input
            className="form-control"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>
        <label className="form-label w-100">
          Email address
          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label className="form-label w-100">
          Password
          <input
            className="form-control"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Create</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}

export default App
