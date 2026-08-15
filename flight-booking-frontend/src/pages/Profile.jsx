import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProfile } from '../api/profile'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await getProfile()
        if (!cancelled) setUser(data.user)
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load your profile.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-runway-900 flex flex-col items-center px-6 py-16">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-amber-signal text-lg">✈</span>
        <span className="font-display text-lg font-semibold tracking-tight text-cloud-50">
          Travelingo
        </span>
      </div>

      <div className="w-full max-w-md bg-runway-800 rounded-2xl shadow-2xl shadow-black/30 px-6 py-8">
        <h1 className="font-display text-2xl font-semibold text-cloud-50 mb-6">
          Your account
        </h1>

        {loading && <p className="text-fog-200 text-sm">Loading…</p>}

        {!loading && error && (
          <p className="text-coral-alert text-sm">{error}</p>
        )}

        {!loading && !error && user && (
          <div className="space-y-4 mb-8">
            <div>
              <span className="block font-mono text-[10px] tracking-widest text-fog-400 uppercase mb-1">
                Email
              </span>
              <span className="text-cloud-50">{user.email}</span>
            </div>
            <div>
              <span className="block font-mono text-[10px] tracking-widest text-fog-400 uppercase mb-1">
                User ID
              </span>
              <span className="text-fog-200 text-xs font-mono">{user.id}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/search"
            className="text-center bg-amber-signal text-runway-900 font-display font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
          >
            Search flights
          </Link>
          <Link
            to="/bookings"
            className="text-center bg-runway-900 border border-fog-400/30 text-cloud-50 font-display py-2.5 rounded-lg transition-colors hover:border-amber-signal hover:text-amber-signal"
          >
            My bookings
          </Link>
          <button
            onClick={handleLogout}
            className="text-center bg-runway-900 border border-fog-400/30 text-cloud-50 font-display py-2.5 rounded-lg transition-colors hover:border-coral-alert hover:text-coral-alert"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
