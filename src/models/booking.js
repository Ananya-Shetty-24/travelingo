const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const seatSchema = new Schema({
    // seatNumber: { type: String},
    class: { type: String, enum: ['economy', 'business', 'first'], required: true },
    price: { type: Number, required: true }
})

const BookingSchema= new mongoose.Schema({
    booking_id:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel'

    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'FlightModel'
  },
    seats:[seatSchema],
    totalAmount:{type:Number,required:true},
    
    status: {
        type: String,
        enum: ['pending', 'delayed', 'cancelled', 'completed'],
        default: 'pending'
   },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000)
    }
}, { timestamps: true });



const BookingModel=mongoose.model('BookingModel',BookingSchema);
module.exports=BookingModel