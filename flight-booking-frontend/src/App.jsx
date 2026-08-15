import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import Results from './pages/Results'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import BookingDetails from './pages/BookingDetails'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/results" element={<Results />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/bookings/:bookingId" element={<BookingDetails />} />
      </Routes>
    </BrowserRouter>
  )
}
