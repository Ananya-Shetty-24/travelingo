import client from './client'

// Confirmed against controllers/payment.js + routes/payment.js:
// POST /payment/payment (protected by authenticateJWT), bookingid sent as
// QUERY STRING, not JSON body. Returns { success, clientSecret, amountInGBP }.
export const createPaymentIntent = async (bookingId) => {
  const { data } = await client.post('/payment/payment', {}, {
    params: { bookingid: bookingId },
  })
  return data
}
