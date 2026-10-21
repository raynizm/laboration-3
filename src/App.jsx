import CreateUserForm from './components/CreateUserForm.jsx'
import UsersTable from './components/UsersTable.jsx'
import useUsers from './hooks/useUsers.js'

function App() {
  const { users, error, addUser, removeUser } = useUsers()

  return (
    <main className="container my-5">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row g-5">
        <section className="col-md-5">
          <h1>Create user</h1>
          <CreateUserForm onCreate={addUser} />
        </section>
        <section className="col-md-7">
          <h1>Users</h1>
          <UsersTable users={users} onDelete={removeUser} />
        </section>
      </div>
    </main>
  )
}

export default App
