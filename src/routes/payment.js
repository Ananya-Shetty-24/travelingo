const express= require('express');
const router=express.Router();
const { syncFlights } = require('../services/aviationstack');
const { searchFlights }=require('../contollers/search');
const {authenticateJWT}=require('../middlewares/auth');
const { bookings } = require('../contollers/bookings');
const {id2}=require('../contollers/id2');
const {deletion}=require('../contollers/id2');
const{payments}=require('../contollers/payment');
const{webhook}=require('../contollers/payment');
router.get('/',(req,res,next)=>{
    res.send("flights route working");
});

router.post("/payment",authenticateJWT,payments);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);




module.exports = router 
