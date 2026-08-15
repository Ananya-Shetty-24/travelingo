// require('dotenv').config();
// const mongoose = require('mongoose');
// const Aircraft = require('../src/models/airplane.js');
// const Flight=require('../src/models/flight.js');
// const Airport =require('../src/models/airport.js');
// const User=require('../src/models/user.js');

// mongoose.connect(process.env.dburi)
//     .then (async()=>{
//         console.log('connected to mongodb');
    
//     await Airport.deleteMany({});
//     await Airport.insertMany([
//         { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
//         { code: 'BOM', name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India' },
//         { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
//         { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
//         { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' }
//     ])
//     await Aircraft.insertMany([
//         {modelName:'AI-203', totalSeats:30,
//         seats: [
//         { seatNumber: '1A', class: 'first', isAvailable: true }
//         ]},
//         {modelName:'CIE-24',totalSeats:50,
//         seats:[
//             { seatNumber: '1B', class: 'first', isAvailable: true },
//         ]}
//     ])

//     const airports = await Airport.find()
//     const delhi = airports.find(a => a.code === 'DEL')
//     const bangalore = airports.find(a => a.code === 'BLR')
//     const bombay=airports.find(a=>a.code=='BOM');

//     await Flight.insertMany([{
//         flightNumber: 'AI-101',
//         origin: bangalore._id,
//         destination: delhi._id,
//         departureTime: new Date('2026-04-01T06:00:00'),
//         arrivalTime: new Date('2026-04-01T08:30:00'),
//         pricing: { economy: 5000, business: 10000, first: 15000 },
//         availableSeats: { economy: 20, business: 6, first: 4 }
//     },
//     {   
//         flightNumber: 'CI-21',
//         origin: bombay._id,
//         destination: bangalore._id,
//         departureTime: new Date('2026-04-25T06:00:00'),
//         arrivalTime: new Date('2026-04-26T08:30:00'),
//         pricing: { economy: 5000, business: 10000, first: 15000 },
//         availableSeats: { economy: 50, business: 6, first: 4 }       
//     }
//     ])

//     await User.insertMany([
//         {name:'aprameya',email:'aprameya@gmail.com',role:'user'},
//         {name:'ananya',email:'ananya@gmail.com',role:'user'}
//     ])

//     await mongoose.disconnect()
//     console.log('Seeding done!')

//     })
//     .catch((err) => {
//     console.error('Connection error:', err);
//   });

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