const axios = require('axios')
const Flight = require('../models/flight.js')
const Airport = require('../models/airport.js')
const AircraftModel = require('../models/airplane.js')


const { syncFlights } = require('../services/aviationstack');
const cron=require('node-cron');




const searchFlights = async (req, res) => {
    try {
        const { dep_iata, arr_iata } = req.query
        const { date, classes } =req.query
        
        const departure = await Airport.findOne({ code: dep_iata })
        const arrival = await Airport.findOne({ code: arr_iata })


        if (!arrival|| !departure) {
            return res.status(404).json({ success: false, message: 'Airport not found' })
        }

        const flights = await Flight.find({
            departure: departure._id,
            arrival: arrival._id,
            //date: new Date(date),
            departureTime: {
                $gte: new Date(date + 'T00:00:00'),
                $lte: new Date(date + 'T23:59:59')
            },
            // [`availableSeats.${classes}`]: { $gt: 0 }
            ...(classes && { [`availableSeats.${classes}`]: { $gt: 0 } })
            


        }).populate('departure arrival')
        console.log('Flights found:', flights.length)

        res.json({ success: true, data: flights })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// const seatMap= async(req,res)=>{
//     try{
//         await searchFlights();
//         const { flightid }=req.query.id;
//         const desired_flight= await Flight.find({
//             flightNumber:flightid,
//         })
//         res.json({sucess:true,seats:desired_flight.availableSeats})

//     } catch(err){
//         res.status(500).json({sucess:false,message:err.message})
//     }
// }

module.exports = { searchFlights }
