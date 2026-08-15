const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const airportSchema = new Schema({
    code:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },    
});

const AirportModel=mongoose.model('AirportModel',airportSchema);
module.exports=AirportModel

