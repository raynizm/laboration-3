const USERS_URL = '/api/users'

async function request(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response
}

export async function fetchUsers() {
  const response = await request(USERS_URL)
  return response.json()
}

export async function createUser({ name, email, password }) {
  const response = await request(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return response.json()
}

export async function deleteUser(id) {
  await request(`${USERS_URL}/${id}`, { method: 'DELETE' })
}
