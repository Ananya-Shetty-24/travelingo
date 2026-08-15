import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import BoardingPassCard from '../components/BoardingPassCard'
import { createBooking } from '../api/bookings'
import { rememberBooking } from '../api/localBookings'

const CLASSES = [
  { key: 'economy', label: 'Economy' },
  { key: 'business', label: 'Business' },
  { key: 'first', label: 'First' },
]

function formatTime(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return '--:--'
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const flight = location.state?.flight

  const [seatClass, setSeatClass] = useState('economy')
  const [passengers, setPassengers] = useState(1)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // No flight was passed in (e.g. page refresh, direct URL visit) —
  // send them back to search rather than showing a broken page.
  if (!flight) {
    return <Navigate to="/search" replace />
  }

  const availableForClass = flight.availableSeats?.[seatClass] ?? 0
  const pricePerSeat = flight.pricing?.[seatClass] ?? 0
  const total = pricePerSeat * passengers

  const handleConfirm = async () => {
    setError(null)

    if (passengers < 1) {
      setError('At least 1 passenger is required.')
      return
    }
    if (passengers > availableForClass) {
      setError(`Only ${availableForClass} seat(s) left in ${seatClass}.`)
      return
    }

    setLoading(true)
    try {
      const data = await createBooking({
        flightNumber: flight.flightNumber,
        seatClass,
        passengers,
      })
      const booking = data.data ?? data
      if (booking?._id) rememberBooking(booking._id)
      navigate('/payment', { state: { booking, flight, seatClass, passengers, total } })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create booking. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-runway-900 flex flex-col items-center px-6 py-16">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-amber-signal text-lg">✈</span>
        <span className="font-display text-lg font-semibold tracking-tight text-cloud-50">
          Travelingo
        </span>
      </div>

      <div className="w-full max-w-md">
        <BoardingPassCard
          pnr={flight.flightNumber}
          footerNote="Confirm your seat class and passenger count"
        >
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-2xl font-semibold text-cloud-50">
                  {formatTime(flight.departureTime)}
                </div>
                <div className="text-fog-200 text-sm">{flight.departure?.code}</div>
              </div>
              <span className="text-fog-400">→</span>
              <div className="text-right">
                <div className="font-display text-2xl font-semibold text-cloud-50">
                  {formatTime(flight.arrivalTime)}
                </div>
                <div className="text-fog-200 text-sm">{flight.arrival?.code}</div>
              </div>
            </div>
          </div>

          <span className="block font-mono text-[10px] tracking-widest text-fog-400 uppercase mb-2">
            Class
          </span>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {CLASSES.map(({ key, label }) => {
              const seatsLeft = flight.availableSeats?.[key] ?? 0
              const disabled = seatsLeft <= 0
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSeatClass(key)}
                  className={`rounded-lg py-2.5 text-sm font-display transition-colors border ${
                    seatClass === key
                      ? 'bg-amber-signal text-runway-900 border-amber-signal'
                      : 'bg-runway-900 text-cloud-50 border-fog-400/30 hover:border-fog-400/60'
                  } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {label}
                  <div className="text-[10px] font-mono opacity-70 mt-0.5">
                    {disabled ? 'Full' : `${seatsLeft} left`}
                  </div>
                </button>
              )
            })}
          </div>

          <label className="block mb-6">
            <span className="block font-mono text-[10px] tracking-widest text-fog-400 uppercase mb-1.5">
              Passengers
            </span>
            <input
              type="number"
              min={1}
              max={availableForClass || 1}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-runway-900 border border-fog-400/30 rounded-lg px-3.5 py-2.5 text-cloud-50 outline-none focus:border-amber-signal focus:ring-2 focus:ring-amber-signal/20"
            />
          </label>

          <div className="flex items-center justify-between mb-6 pt-4 border-t border-dashed border-fog-400/30">
            <span className="text-fog-200 text-sm">Total</span>
            <span className="font-display text-xl text-cloud-50">₹{total}</span>
          </div>

          {error && <p className="text-coral-alert text-sm mb-4">{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={loading || availableForClass === 0}
            className="w-full bg-amber-signal text-runway-900 font-display font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Booking…' : 'Continue to payment'}
          </button>
        </BoardingPassCard>
      </div>
    </div>
  )
}
