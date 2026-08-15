import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBooking, cancelBooking } from '../api/bookings'
import BoardingPassCard from '../components/BoardingPassCard'

export default function BookingDetails() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const loadBooking = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBooking(bookingId)
      setBooking(data.data ?? data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this booking.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId])

  const handlePayNow = () => {
    // Payment.jsx only needs booking._id — it fetches the PaymentIntent
    // itself, so flight/seatClass/passengers aren't required here.
    navigate('/payment', { state: { booking } })
  }

  const handleCancel = async () => {
    setCancelling(true)
    setError(null)
    try {
      await cancelBooking(bookingId)
      await loadBooking()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this booking.')
    } finally {
      setCancelling(false)
    }
  }

  const canCancel = booking && !['cancelled', 'expired'].includes(booking.status)
  const canPay = booking && booking.status === 'pending'

  return (
    <div className="min-h-screen bg-runway-900 flex flex-col items-center px-6 py-16">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-amber-signal text-lg">✈</span>
        <span className="font-display text-lg font-semibold tracking-tight text-cloud-50">
          Travelingo
        </span>
      </div>

      <div className="w-full max-w-md">
        {loading && <p className="text-fog-200 text-sm text-center">Loading…</p>}

        {!loading && error && !booking && (
          <p className="text-coral-alert text-sm text-center">{error}</p>
        )}

        {!loading && booking && (
          <BoardingPassCard
            pnr={booking._id.slice(-6).toUpperCase()}
            footerNote={`Status: ${booking.status}`}
          >
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-fog-200 text-sm">Seats</span>
                <span className="text-cloud-50 text-sm">
                  {booking.seats?.map((s) => s.class).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-fog-200 text-sm">Total</span>
                <span className="text-cloud-50 text-sm">₹{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fog-200 text-sm">Status</span>
                <span className="text-cloud-50 text-sm capitalize">{booking.status}</span>
              </div>
            </div>

            {error && <p className="text-coral-alert text-sm mb-4">{error}</p>}

            <div className="flex flex-col gap-3">
              {canPay && (
                <button
                  onClick={handlePayNow}
                  className="w-full bg-amber-signal text-runway-900 font-display font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
                >
                  Pay now
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full bg-runway-900 border border-fog-400/30 text-coral-alert font-display py-2.5 rounded-lg transition-colors hover:border-coral-alert disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling…' : 'Cancel booking'}
                </button>
              )}
            </div>
          </BoardingPassCard>
        )}

        <Link
          to="/bookings"
          className="block text-center mt-6 text-sm text-amber-signal hover:underline font-mono"
        >
          Back to my bookings
        </Link>
      </div>
    </div>
  )
}
