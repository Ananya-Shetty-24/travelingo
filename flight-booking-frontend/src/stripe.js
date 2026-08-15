import { loadStripe } from '@stripe/stripe-js'

// Publishable key only — safe for frontend. Never put the secret key here.
const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!key) {
  console.warn(
    'VITE_STRIPE_PUBLISHABLE_KEY is not set — payments will fail. Add it to .env'
  )
}

export const stripePromise = loadStripe(key || '')
