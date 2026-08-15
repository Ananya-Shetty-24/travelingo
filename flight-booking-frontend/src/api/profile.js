import client from './client'

// Confirmed against server.js: GET /profile, protected by authenticateJWT.
// Returns { message, user: { id, email } } — the JWT payload only has
// id + email (see controllers/login.js payload), nothing richer like name.
export const getProfile = async () => {
  const { data } = await client.get('/profile')
  return data
}
