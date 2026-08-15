import client from './client'

// Routes confirmed from routes/user.js + server.js: server mounts
// users router at '/users', so POST /users/login and POST /users/register.
export const login = async ({ email, password }) => {
  const { data } = await client.post('/users/login', { email, password })
  return data // => { token }
}

export const register = async ({ name, email, password }) => {
  const { data } = await client.post('/users/register', { name, email, password })
  return data
  // Confirmed shape: { success: true, data: { id, name, email } }
  // Note: your register controller sets `id: user` (the full document)
  // instead of `id: user._id` — not something the frontend needs, but
  // worth fixing on the backend if anything downstream expects a plain id.
}
