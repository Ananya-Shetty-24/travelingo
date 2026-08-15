import client from './client'

// Confirmed against controllers/search.js — GET /flights/search
// accepts dep_iata, arr_iata, date (and optional classes), and returns:
// { success: true, data: [{ _id, flightNumber, departure: { code, name, city },
//   arrival: { code, name, city }, departureTime, arrivalTime, status,
//   pricing: { economy, business, first },
//   availableSeats: { economy, business, first } }] }
export const searchFlights = async ({ dep_iata, arr_iata, date, classes }) => {
  const { data } = await client.get('/flights/search', {
    params: { dep_iata, arr_iata, date, classes },
  })
  return data
}
