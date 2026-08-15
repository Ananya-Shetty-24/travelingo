import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import BoardingPassCard from '../components/BoardingPassCard'
import FormField from '../components/FormField'
import { login } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const justRegistered = location.state?.justRegistered
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(form)
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      navigate('/search')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not sign in. Check your details and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to continue booking"
      subtitle="Pick up where you left off — your saved trips and past bookings are waiting."
    >
      <BoardingPassCard pnr="SIGNIN" footerNote="Enter your details to check in">
        <form onSubmit={handleSubmit}>
          {justRegistered && (
            <p className="text-amber-signal text-sm mb-4 -mt-2">
              Account created — sign in to continue.
            </p>
          )}
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-coral-alert text-sm mb-4 -mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-signal text-runway-900 font-display font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-5 text-center text-sm text-fog-200">
            New here?{' '}
            <Link to="/signup" className="text-amber-signal hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </BoardingPassCard>
    </AuthLayout>
  )
}
