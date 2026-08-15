const mongoose = require('mongoose')
const axios = require('axios')
const Flight = require('../models/flight.js')
const Airport = require('../models/airport.js')
const AircraftModel = require('../models/airplane.js')


const { syncFlights } = require('../services/aviationstack');
const cron=require('node-cron');
const { searchFlights } = require('../contollers/search');
const Booking = require('../models/booking.js')


const bookings = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const flightid = req.query.flightid
        const seat_class = req.query.class
        const num = parseInt(req.query.num)

        const flight = await Flight.findOne({ flightNumber: flightid }).session(session)

        if (!flight) {
            await session.abortTransaction()
            session.endSession()
            return res.status(404).json({ success: false, message: 'Flight not found' })
        }

        if (flight.availableSeats[seat_class] <= 0) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({ success: false, message: 'No seats available' })
        }

        const total_cost = flight.pricing[seat_class] * num

        flight.availableSeats[seat_class] -= num
        await flight.save({ session })

        const seat = {
            seatNumber: `${seat_class}-${num}`,
            class: seat_class,
            price: flight.pricing[seat_class],
        }

        const booking = new Booking({
            user: req.user.id,
            flight: flight._id,
            seats: [seat],
            totalAmount: total_cost,
            status: 'pending',
        })

        await booking.save({ session })
        await session.commitTransaction()
        session.endSession()

        res.status(201).json({ success: true, data: booking })
    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction()
        }
        session.endSession()
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: err.message })
        }
    }
}

module.exports = { bookings }
