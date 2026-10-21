import { useState } from 'react'

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' }

function App() {
  const [form, setForm] = useState(emptyForm)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setForm(emptyForm)
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

export default App
