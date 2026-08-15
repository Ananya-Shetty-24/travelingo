// WORKAROUND — there is no backend endpoint that lists all bookings for a
// user, so this tracks booking IDs created in this browser as a stand-in
// "my bookings" list. It's not a real source of truth: it won't show
// bookings made on another device/browser, and clearing browser storage
// loses the list. A real GET /bookings (list mine) endpoint on the backend
// would replace this entirely.
const STORAGE_KEY = 'myBookingIds'

export const rememberBooking = (bookingId) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  if (!existing.includes(bookingId)) {
    existing.unshift(bookingId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  }
}

export const getRememberedBookingIds = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}
