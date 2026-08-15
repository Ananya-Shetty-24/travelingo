import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT (if present) to every outgoing request — server.js
// protects routes like /profile with authenticateJWT, and booking/payment
// will very likely need this too.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
