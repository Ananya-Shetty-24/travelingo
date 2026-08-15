import client from './client'

// Confirmed against controllers/bookings.js + routes/booking.js:
// POST /bookings/booking (protected by authenticateJWT), params sent as
// QUERY STRING (req.query), not JSON body — despite being a POST.
// - flightid: flight.flightNumber (a string like "BZ684"), NOT the Mongo _id
// - class: seat class key — economy | business | first
// - num: passenger count
// Response: { success: true, data: booking } where booking has
// { _id, user, flight, seats: [{ seatNumber, class, price }], totalAmount, status }
export const createBooking = async ({ flightNumber, seatClass, passengers }) => {
  const { data } = await client.post('/bookings/booking', {}, {
    params: {
      flightid: flightNumber,
      class: seatClass,
      num: passengers,
    },
  })
  return data
}

// Confirmed against controllers/id2.js — GET /bookings/id?bookingid=X,
// protected, returns { success, data: booking } where booking.user is
// populated with { name, email } but booking.flight is just an ObjectId
// (not populated), so flight details aren't available from this call.
export const getBooking = async (bookingId) => {
  const { data } = await client.get('/bookings/id', {
    params: { bookingid: bookingId },
  })
  return data
}

// Confirmed against controllers/id2.js — GET /bookings/deletion?bookingid=X
// (a GET that mutates — unusual, but that's what the backend defines).
// Cancels the booking and frees the seat(s).
export const cancelBooking = async (bookingId) => {
  const { data } = await client.get('/bookings/deletion', {
    params: { bookingid: bookingId },
  })
  return data
}
