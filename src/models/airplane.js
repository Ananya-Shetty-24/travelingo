const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const smallSchema = new Schema({
    seatNumber:{
        type:String,
        required:true
    },
    class:{
        type:String,
        enum: ['economy', 'business', 'first'],
        required:true,
    },
    isAvailable: {
        type: Boolean,
        default: true
}
})

const aircraftSchema=new Schema({
    modelName:{
        type:String,
        required:true,
    },
    totalSeats:{
        type:Number,
        required:true,
    },
    seats:[smallSchema]
})

const AircraftModel=mongoose.model('AircraftModel',aircraftSchema);
module.exports=AircraftModel