import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '../stripe'
import { createPaymentIntent } from '../api/payments'
import BoardingPassCard from '../components/BoardingPassCard'

function CheckoutForm({ amountInGBP }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError(null)

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      })

      // If we get here without a full-page redirect, either the payment
      // method needed no redirect and Stripe still returned control to us,
      // or something went wrong — confirmError tells us which.
      if (confirmError) {
        setError(confirmError.message || 'Payment failed. Try again.')
      }
    } catch (err) {
      // Catches anything confirmPayment throws outright (bad clientSecret,
      // network failure, misconfigured publishable key, etc.) instead of
      // leaving the button stuck on "Processing…" with no feedback.
      setError(err.message || 'Something went wrong starting the payment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {error && <p className="text-coral-alert text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full mt-6 bg-amber-signal text-runway-900 font-display font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Processing…' : `Pay £${amountInGBP}`}
      </button>
    </form>
  )
}

export default function Payment() {
  const location = useLocation()
  const booking = location.state?.booking

  const [clientSecret, setClientSecret] = useState(null)
  const [amountInGBP, setAmountInGBP] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!booking?._id) return

    let cancelled = false
    const run = async () => {
      try {
        const data = await createPaymentIntent(booking._id)
        if (!cancelled) {
          setClientSecret(data.clientSecret)
          setAmountInGBP(data.amountInGBP)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not start payment. Try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [booking?._id])

  if (!booking?._id) {
    return <Navigate to="/search" replace />
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
        <BoardingPassCard pnr={booking._id?.slice(-6)?.toUpperCase()} footerNote="Secure payment via Stripe">
          {loading && <p className="text-fog-200 text-sm">Setting up payment…</p>}

          {!loading && error && <p className="text-coral-alert text-sm">{error}</p>}

          {!loading && !error && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amountInGBP={amountInGBP} />
            </Elements>
          )}
        </BoardingPassCard>
      </div>
    </div>
  )
}
