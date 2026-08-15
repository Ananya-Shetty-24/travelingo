require('dotenv').config();
const mongoose = require('mongoose');
const Airport = require('../src/models/airport.js');
const Flight = require('../src/models/flight.js');
 
// Dummy flights for local testing without touching the aviationstack quota.
// Dates are deliberately fixed — search using these exact dates, or adjust
// the dates below to match whatever date you're testing with.
// CI-21 is deliberately sold out in economy, to test the "no seats
// available" error path without wasting a real API call.
const FLIGHTS = [
    {
        flightNumber: 'AI-101',
        origin: 'BLR',
        destination: 'DEL',
        departureTime: '2026-08-20T06:00:00',
        arrivalTime: '2026-08-20T08:30:00',
        status: 'scheduled',
        pricing: { economy: 5000, business: 10000, first: 15000 },
        availableSeats: { economy: 20, business: 6, first: 4 },
    },
    {
        flightNumber: 'CI-21',
        origin: 'BOM',
        destination: 'BLR',
        departureTime: '2026-11-11T09:00:00',
        arrivalTime: '2026-11-11T11:15:00',
        status: 'scheduled',
        pricing: { economy: 4500, business: 9000, first: 14000 },
        availableSeats: { economy: 0, business: 2, first: 1 }, // sold out in economy on purpose
    },
    {
        flightNumber: 'HY-303',
        origin: 'HYD',
        destination: 'MAA',
        departureTime: '2026-08-20T14:00:00',
        arrivalTime: '2026-08-20T15:30:00',
        status: 'scheduled',
        pricing: { economy: 3500, business: 7000, first: 11000 },
        availableSeats: { economy: 15, business: 4, first: 2 },
    },
    {
        flightNumber: 'CC-707',
        origin: 'CCU',
        destination: 'DEL',
        departureTime: '2026-08-21T07:00:00',
        arrivalTime: '2026-08-21T09:20:00',
        status: 'scheduled',
        pricing: { economy: 4800, business: 9500, first: 14500 },
        availableSeats: { economy: 25, business: 5, first: 3 },
    },
]
 
mongoose.connect(process.env.dburi)
    .then(async () => {
        console.log('connected to mongodb')
 
        const codesNeeded = [...new Set(FLIGHTS.flatMap(f => [f.origin, f.destination]))]
        const airports = await Airport.find({ code: { $in: codesNeeded } })
        const airportByCode = Object.fromEntries(airports.map(a => [a.code, a]))
 
        const missing = codesNeeded.filter(code => !airportByCode[code])
        if (missing.length > 0) {
            throw new Error(
                `These airport codes aren't seeded yet, run your airport seed first: ${missing.join(', ')}`
            )
        }
 
        const flightsToInsert = FLIGHTS.map(f => ({
            flightNumber: f.flightNumber,
            departure: airportByCode[f.origin]._id,
            arrival: airportByCode[f.destination]._id,
            departureTime: new Date(f.departureTime),
            arrivalTime: new Date(f.arrivalTime),
            status: f.status,
            pricing: f.pricing,
            availableSeats: f.availableSeats,
        }))
 
        // Upsert by flightNumber so re-running this script doesn't create
        // duplicates or wipe out real synced flights with other numbers.
        for (const flight of flightsToInsert) {
            await Flight.updateOne(
                { flightNumber: flight.flightNumber },
                { $set: flight },
                { upsert: true }
            )
        }
 
        console.log(`Seeded/updated ${flightsToInsert.length} dummy flights`)
 
        await mongoose.disconnect()
        console.log('Done!')
    })
    .catch((err) => {
        console.error('Seed error:', err.message)
        process.exit(1)
    })