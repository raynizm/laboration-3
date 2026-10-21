import { useEffect, useState } from 'react'
import { PasswordGenerator } from 'laboration-2'

const MIN_ROWS = 5

const passwordGenerator = new PasswordGenerator()

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' }

function App() {
  const [form, setForm] = useState(emptyForm)
  const [users, setUsers] = useState([])
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password } = form
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const user = await res.json()
    setUsers([...users, user])
    setForm(emptyForm)
  }

  const handleDelete = async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    setUsers(users.filter((user) => user.id !== id))
  }

  const handleGeneratePassword = () => {
    const password = passwordGenerator.generateStrong(16)
    setForm({ ...form, password, confirmPassword: password })
  }

  const handleClear = () => {
    setForm(emptyForm)
  }

  return (
    <main className="container my-5">
      <div className="row g-5">
        <section className="col-md-5">
          <h1>Create user</h1>
          <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
            <label className="form-label w-100">
              Name
              <input
                className="form-control"
                type="text"
                name="name"
                value={form.name}
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
            <div>
              <div className="d-flex justify-content-between align-items-end mb-2">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleGeneratePassword}
                >
                  Generate password
                </button>
              </div>
              <div className="input-group">
                <input
                  id="password"
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    {showPassword ? (
                      <>
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                      </>
                    ) : (
                      <>
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <label className="form-label w-100">
              Confirm password
              <input
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </label>
            <div className="d-flex justify-content-between gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </section>
        <section className="col-md-7">
          <h1>Users</h1>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      aria-label={`Delete ${user.name}`}
                      onClick={() => handleDelete(user.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {Array.from(
                { length: Math.max(0, MIN_ROWS - users.length) },
                (_, i) => (
                  <tr key={`empty-${i}`} style={{ height: '3.25rem' }}>
                    <td colSpan={4}></td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

export default App
