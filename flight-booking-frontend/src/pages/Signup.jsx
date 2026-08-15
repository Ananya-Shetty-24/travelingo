import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import BoardingPassCard from '../components/BoardingPassCard'
import FormField from '../components/FormField'
import { register } from '../api/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      // register controller's response shape isn't confirmed to include a
      // token, so we don't auto-sign-in here — send them to log in instead.
      navigate('/login', { state: { justRegistered: true } })
    } catch (err) {
      const data = err.response?.data
      // register controller returns two different error shapes:
      // - validation errors: { errors: [{ msg, path, ... }] }
      // - everything else (duplicate email, server error): { message }
      const firstValidationError = data?.errors?.[0]?.msg
      setError(
        firstValidationError || data?.message || 'Could not create your account. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="First time flying with us"
      title="Create your account"
      subtitle="One account to search, book, and manage every trip in one place."
    >
      <BoardingPassCard pnr="NEWUSR" footerNote="Fill in your details to book your first flight">
        <form onSubmit={handleSubmit}>
          <FormField
            label="Full name"
            type="text"
            name="name"
            placeholder="Ananya"
            value={form.name}
            onChange={handleChange}
            required
          />
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
          <FormField
            label="Confirm password"
            type="password"
            name="confirm"
            placeholder="••••••••"
            value={form.confirm}
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="mt-5 text-center text-sm text-fog-200">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-signal hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </BoardingPassCard>
    </AuthLayout>
  )
}
