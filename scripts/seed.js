

require('dotenv').config();
const mongoose = require('mongoose');
const Airport = require('../src/models/airport.js');

const AIRPORTS = [
    { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India' },
    { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
    { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
]

mongoose.connect(process.env.dburi)
    .then(async () => {
        console.log('connected to mongodb')
        await Airport.deleteMany({})
        await Airport.insertMany(AIRPORTS)
        console.log(`Seeded ${AIRPORTS.length} airports`)
        await mongoose.disconnect()
    })
    .catch((err) => {
        console.error('Seed error:', err.message)
        process.exit(1)
    })
