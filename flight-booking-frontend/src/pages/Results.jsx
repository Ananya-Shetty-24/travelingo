import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { searchFlights } from '../api/flights'
import FlightCard from '../components/FlightCard'

export default function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const dep_iata = searchParams.get('dep_iata')
  const arr_iata = searchParams.get('arr_iata')
  const date = searchParams.get('date')

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchFlights({ dep_iata, arr_iata, date })
        if (!cancelled) setFlights(data.data ?? data ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Could not fetch flights. Try again.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (dep_iata && arr_iata) run()
    else {
      setLoading(false)
      setError('Missing search details — go back and search again.')
    }

    return () => {
      cancelled = true
    }
  }, [dep_iata, arr_iata, date])

  const handleSelect = (flight) => {
    navigate('/booking', { state: { flight } })
  }

  return (
    <div className="min-h-screen bg-runway-900 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-cloud-50">
              {dep_iata} <span className="text-fog-400">→</span> {arr_iata}
            </h1>
            {date && <p className="text-fog-200 text-sm mt-1">{date}</p>}
          </div>
          <Link
            to="/search"
            className="text-sm text-amber-signal hover:underline font-mono"
          >
            New search
          </Link>
        </div>

        {loading && (
          <p className="text-fog-200 text-sm">Searching flights…</p>
        )}

        {!loading && error && (
          <p className="text-coral-alert text-sm">{error}</p>
        )}

        {!loading && !error && flights.length === 0 && (
          <p className="text-fog-200 text-sm">
            No flights found for this route and date.
          </p>
        )}

        {!loading && !error && flights.length > 0 && (
          <div className="flex flex-col gap-4">
            {flights.map((flight) => (
              <FlightCard
                key={flight._id ?? flight.flightNumber}
                flight={flight}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
