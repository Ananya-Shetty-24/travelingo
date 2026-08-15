


const axios = require('axios')
const Flight = require('../models/flight.js')
const Airport = require('../models/airport.js')


const runSync = async (dep_iata, arr_iata) => {
    if (!dep_iata || !arr_iata) {
        throw new Error('runSync requires dep_iata and arr_iata')
    }

    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
        params: {
            access_key: process.env.API_KEY,
            dep_iata,
            arr_iata,
        },
    })

    const result = response.data.data
    console.log(`Fetched ${result.length} flights for ${dep_iata} -> ${arr_iata}`)

    let synced = 0
    let skipped = 0

    for (const flight of result) {
        if (!flight.flight?.iata || !flight.departure?.iata || !flight.arrival?.iata) {
            console.log('Skipping — incomplete flight/airport data')
            skipped++
            continue
        }

        const originAirport = await Airport.findOne({ code: flight.departure.iata })
        const destAirport = await Airport.findOne({ code: flight.arrival.iata })

        if (!originAirport || !destAirport) {
            console.log(`Skipping — airport not seeded (${flight.departure.iata} / ${flight.arrival.iata})`)
            skipped++
            continue
        }

        const departureTime = new Date(flight.departure.scheduled)
        const arrivalTime = new Date(flight.arrival.scheduled)

        if (isNaN(departureTime) || isNaN(arrivalTime)) {
            console.log(`Skipping — invalid date for flight ${flight.flight.iata}`)
            skipped++
            continue
        }

        try {
            await Flight.updateOne(
                {
                    flightNumber: flight.flight.iata,
                    departureTime,
                },
                {
                    $set: {
                        flightNumber: flight.flight.iata,
                        departure: originAirport._id,
                        arrival: destAirport._id,
                        departureTime,
                        arrivalTime,
                        status: flight.flight_status,
                        lastSyncedAt: new Date(),
                    },
                    $setOnInsert: {
                        pricing: { economy: 5000, business: 10000, first: 15000 },
                        availableSeats: { economy: 50, business: 10, first: 5 },
                    },
                },
                { upsert: true }
            )
            synced++
        } catch (writeErr) {
            console.log(`Skipping — failed to save ${flight.flight.iata}: ${writeErr.message}`)
            skipped++
        }
    }

    console.log(`Sync complete for ${dep_iata} -> ${arr_iata}: synced ${synced}, skipped ${skipped}`)
    return { synced, skipped }
}


const syncFlights = async (req, res) => {
    try {
        const { dep_iata, arr_iata } = req.query

        if (!dep_iata || !arr_iata) {
            return res.status(400).json({
                success: false,
                message: 'dep_iata and arr_iata query params are required',
            })
        }

        const { synced, skipped } = await runSync(dep_iata, arr_iata)

        return res.json({
            success: true,
            message: `Synced ${synced} flights, skipped ${skipped}`,
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { syncFlights, runSync }
