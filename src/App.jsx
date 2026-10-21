import { useEffect, useState } from 'react'

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' }

function App() {
  const [form, setForm] = useState(emptyForm)
  const [users, setUsers] = useState([])

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
                >
                  Generate password
                </button>
              </div>
              <input
                id="password"
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <label className="form-label w-100">
              Confirm password
              <input
                className="form-control"
                type="password"
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
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

export default App
