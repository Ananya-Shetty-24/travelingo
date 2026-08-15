const mongoose = require('mongoose')
const axios = require('axios')
const Flight = require('../models/flight.js')
const Airport = require('../models/airport.js')
const AircraftModel = require('../models/airplane.js')
const express= require('express');

const User = require('../models/user.js')


const { syncFlights } = require('../services/aviationstack');
const cron=require('node-cron');
const { searchFlights } = require('../contollers/search');
const Booking = require('../models/booking.js')

const stripe=require('stripe')(process.env.STRIPE)
const { sendBookingConfirmation } = require('../services/emails')


const { convertINRtoGBP } = require('../services/exchange')

const payments = async (req, res) => {
    try {
        const booking = await Booking.findById(req.query.bookingid)
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' })
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not your booking' })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Booking is not pending' })
        }

        
        const amountInPence = await convertINRtoGBP(booking.totalAmount)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPence,
            currency: 'gbp',
            metadata: { bookingId: req.query.bookingid }
        })

        res.status(200).json({ 
            success: true, 
            clientSecret: paymentIntent.client_secret,
            amountInGBP: (amountInPence / 100).toFixed(2)  // show user how much in GBP
        })

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// 

const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature']

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )

        if (event.type === 'payment_intent.succeeded') {
            const bookingId = event.data.object.metadata.bookingId

            // Update booking status
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                { status: 'confirmed' },
                { new: true }
            )

            // Get user and flight details for email
            const user = await User.findById(booking.user)
            const flight = await Flight.findById(booking.flight)

            // Send confirmation email
            await sendBookingConfirmation(user, booking, flight)

            console.log('Booking confirmed and email sent:', bookingId)
        }

        res.json({ received: true })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
module.exports = { payments, webhook }