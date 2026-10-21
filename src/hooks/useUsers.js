import { useEffect, useState } from 'react'
import { createUser, deleteUser, fetchUsers } from '../api/usersApi.js'

/**
 * Keeps the registered users in sync with the API.
 * Failed requests set `error` instead of throwing into the components.
 */
export default function useUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError('Could not load users.'))
  }, [])

  /** @returns {Promise<boolean>} True if the user was created. */
  const addUser = async (userData) => {
    try {
      const user = await createUser(userData)
      setUsers((current) => [...current, user])
      setError(null)
      return true
    } catch {
      setError('Could not create the user.')
      return false
    }
  }

  const removeUser = async (id) => {
    try {
      await deleteUser(id)
      setUsers((current) => current.filter((user) => user.id !== id))
      setError(null)
    } catch {
      setError('Could not delete the user.')
    }
  }

  return { users, error, addUser, removeUser }
}
