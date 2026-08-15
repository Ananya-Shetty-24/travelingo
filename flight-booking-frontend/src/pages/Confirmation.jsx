import { Link } from 'react-router-dom'

export default function Confirmation() {
  return (
    <div className="min-h-screen bg-runway-900 flex flex-col items-center justify-center px-6 text-center">
      <span className="text-amber-signal text-4xl mb-4">✈</span>
      <h1 className="font-display text-2xl font-semibold text-cloud-50 mb-2">
        Payment received
      </h1>
      <p className="text-fog-200 text-sm max-w-sm mb-8">
        Your booking is being confirmed. You'll get an email once it's finalized —
        this can take a few moments.
      </p>
      <Link
        to="/search"
        className="text-amber-signal hover:underline font-mono text-sm"
      >
        Book another flight
      </Link>
    </div>
  )
}
