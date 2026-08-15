const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const flightSchema= new mongoose.Schema({
    flightNumber:String,
    aircraftmodel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AirplaneModel'

    },
    departure: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'AirportModel'
  },
    arrival: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'AirportModel'
  },
    departureTime: Date ,
    arrivalTime: Date,
    
    pricing: {
        economy: Number,
        business: Number,
        first: Number
   },

   status: {
        type: String,
        enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
        default: 'scheduled'
   },

    availableSeats: {
        economy: Number,
        business: Number,
        first: Number
    }
  // Other fields
});

flightSchema.index({ origin: 1, destination: 1, departureTime: 1 })


const FlightModel=mongoose.model('FlightModel',flightSchema);
module.exports=FlightModel
