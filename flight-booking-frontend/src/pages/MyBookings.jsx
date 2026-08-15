import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBooking } from '../api/bookings'
import { getRememberedBookingIds } from '../api/localBookings'

const STATUS_COLORS = {
  pending: 'text-amber-signal',
  confirmed: 'text-green-400',
  cancelled: 'text-coral-alert',
  expired: 'text-fog-400',
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const ids = getRememberedBookingIds()
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const data = await getBooking(id)
            return data.data ?? data
          } catch {
            return null // booking might belong to another account, or was deleted
          }
        })
      )
      if (!cancelled) {
        setBookings(results.filter(Boolean))
        setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-runway-900 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-semibold text-cloud-50">
            My bookings
          </h1>
          <Link to="/search" className="text-sm text-amber-signal hover:underline font-mono">
            New search
          </Link>
        </div>

        <p className="text-fog-400 text-xs font-mono mb-6">
          Showing bookings made in this browser only.
        </p>

        {loading && <p className="text-fog-200 text-sm">Loading…</p>}

        {!loading && bookings.length === 0 && (
          <p className="text-fog-200 text-sm">No bookings found yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <Link
              key={b._id}
              to={`/bookings/${b._id}`}
              className="flex items-center justify-between bg-runway-800 rounded-xl px-5 py-4 hover:bg-runway-700 transition-colors"
            >
              <div>
                <span className="block font-mono text-[11px] text-fog-400 uppercase tracking-widest">
                  Booking {b._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-cloud-50 text-sm">₹{b.totalAmount}</span>
              </div>
              <span className={`font-mono text-xs uppercase ${STATUS_COLORS[b.status] || 'text-fog-200'}`}>
                {b.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
