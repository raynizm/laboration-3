import { TrashIcon } from './Icons.jsx'

const MIN_ROWS = 5
const COLUMN_COUNT = 4
const PLACEHOLDER_ROW_HEIGHT = '3.25rem'

function UserRow({ user, onDelete }) {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td className="text-end">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          aria-label={`Delete ${user.name}`}
          onClick={() => onDelete(user.id)}
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  )
}

function PlaceholderRows({ count }) {
  return Array.from({ length: count }, (_, index) => (
    <tr key={`placeholder-${index}`} style={{ height: PLACEHOLDER_ROW_HEIGHT }}>
      <td colSpan={COLUMN_COUNT}></td>
    </tr>
  ))
}

function UsersTable({ users, onDelete }) {
  const placeholderCount = Math.max(0, MIN_ROWS - users.length)

  return (
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
          <UserRow key={user.id} user={user} onDelete={onDelete} />
        ))}
        <PlaceholderRows count={placeholderCount} />
      </tbody>
    </table>
  )
}

export default UsersTable
