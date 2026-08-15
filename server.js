// const http= require("http");

// const server = http.createServer((req,res)=>{
//     res.setHeader('Content-type', 'text/plain');
//     res.write("cup");
//     res.end();

// });

// server.listen("3000",()=> {
//     console.log("listening");
// });
// ✅ Must be before express.json()
// server.use('/payments/webhook', express.raw({ type: 'application/json' }))

const mongoose=require('mongoose');
require('dotenv').config();
const express = require('express');
const flights=require('./src/routes/flights');
const booking=require('./src/routes/booking');
const users=require('./src/routes/user');
const sync=require('./src/routes/syncflights');
const Aircraft = require('./src/models/airplane.js');
const Flight=require('./src/models/flight.js');
const Airport =require('./src/models/airport.js');
const User=require('./src/models/user.js');
const { syncFlights } = require('./src/contollers/crons.js')
const {limiter}=require('./src/middlewares/limiter.js');

const cors = require('cors')


require('./src/contollers/crons.js')  // starts the cron job

// const dburi= 'mongodb+srv://annie2:PQRST12345@cluster0.4tlshaj.mongodb.net/?appName=Cluster0';
// mongoose.connect(dburi)
//     .then((result)=> console.log("connected"))
//     .catch((error)=>console.log(error));
const { authenticateJWT } = require('./src/middlewares/auth.js')
const server = express();

const connectDB=require('./src/contollers/db');
connectDB()

server.use(express.json())
server.use(limiter);
server.use(cors());

server.get('/', (req, res) => {
    res.send("Flight booking API is alive");
});

// server.post('/bookings',(req,res)=>{
//     var bookings =req.params.body;

// });

// server.post('/register',async(req,res)=>{
//     try{
//         const user1= new User({
//             name:req.body.name;
//             email:req.body.email;
//             role:req.body.role;
//             password:req.body.password;
//         });
//         await user1.save();
//         res.send({ success: true, data: { id, name, email } });
//     }
//     catch(err){
//         console.error('Error saving user data:', err);
//         res.status(500).render('index', { error: 'Error saving user data' });
//     }


// });



server.use("/flights",flights);
server.use("/users",users);
server.use("/bookings",booking);
server.use("/sync",sync);



server.get("/profile",authenticateJWT,(req,res)=>{
    res.json({message:'profile accessed',user:req.user});
})

const paymentRouter = require('./src/routes/payment')
server.use('/payment', paymentRouter)


server.listen(3000, () => {
    console.log("Server running on port 3000");
});



