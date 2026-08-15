const express= require('express');
const router=express.Router();
const { syncFlights } = require('../services/aviationstack');
const { searchFlights }=require('../contollers/search');
const {authenticateJWT}=require('../middlewares/auth');
const { bookings } = require('../contollers/bookings');
const {id2}=require('../contollers/id2');
const {deletion}=require('../contollers/id2');
router.get('/',(req,res,next)=>{
    res.send("flights route working");
});

router.post("/booking",authenticateJWT,bookings);
router.get("/id",authenticateJWT,id2);
router.get("/deletion",authenticateJWT,deletion);
module.exports=router;