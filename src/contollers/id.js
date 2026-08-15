const axios = require('axios')
const Flight = require('../models/flight.js')
const Airport = require('../models/airport.js')
const AircraftModel = require('../models/airplane.js')


const { syncFlights } = require('../services/aviationstack');
const cron=require('node-cron');
const { searchFlights } = require('../contollers/search');

const id= async(req,res)=>{
    try{
        // await searchFlights();
        const flightid =req.query.flightid;
        const desired_flight= await Flight.findOne({
            flightNumber:flightid,
        })
        if (!desired_flight) {
            return res.status(404).json({ success: false, message: "Flight not found" });
        }

        res.json({sucess:true,seats:desired_flight.availableSeats})

    } catch(err){
        res.status(500).json({sucess:false,message:err.message})
    }
}

module.exports = { id }