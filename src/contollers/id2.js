const mongoose=require('mongoose');
const axios = require('axios')
const Flight = require('../models/flight.js')
const Airport = require('../models/airport.js')
const AircraftModel = require('../models/airplane.js')
const Booking = require('../models/booking.js')
const User = require('../models/user.js')
const { sendCancellationEmail } = require('../services/emails')

const { syncFlights } = require('../services/aviationstack');
const cron=require('node-cron');
const { searchFlights } = require('../contollers/search');

const id2 = async (req, res) => {
    try {
        const bookingid = req.query.bookingid

        const desired_booking = await Booking.findById(bookingid)
            .populate('user', 'name email')
            

        if (!desired_booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' })
        }

        if (desired_booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not your booking' })
        }

        res.json({ success: true, data: desired_booking })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
    
}
const deletion = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const bookingid = req.query.bookingid

        const desired_booking = await Booking.findById(bookingid)
            .populate('user', 'name email')
            .session(session)

        // 1. Check booking exists
        if (!desired_booking) {
            await session.abortTransaction()
            return res.status(404).json({ success: false, message: 'Booking not found' })
        }

        // 2. Check it belongs to logged in user
        if (desired_booking.user._id.toString() !== req.user.id) {
            await session.abortTransaction()
            return res.status(403).json({ success: false, message: 'Not your booking' })
        }

        // 3. Check it can be cancelled
        if (desired_booking.status === 'cancelled' || desired_booking.status === 'expired') {
            await session.abortTransaction()
            return res.status(400).json({ success: false, message: 'Booking already cancelled or expired' })
        }

        // 4. Update status
        desired_booking.status = 'cancelled'
        await desired_booking.save({ session })

        // 5. Free up seats
        const flight = await Flight.findById(desired_booking.flight).session(session)
        flight.availableSeats[desired_booking.seats[0].class] += desired_booking.seats.length
        await flight.save({ session })

        // 6. Commit
        await session.commitTransaction()
        session.endSession()

        res.status(200).json({ success: true, message: 'Booking cancelled', data: desired_booking })
        const user = await User.findById(desired_booking.user)
        await sendCancellationEmail(user, desired_booking)

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { id2, deletion }


