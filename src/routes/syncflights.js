const express= require('express');
const router=express.Router();
const { syncFlights } = require('../services/aviationstack');
const { searchFlights }=require('../contollers/search');
const { id }=require('../contollers/id');


router.post("/",syncFlights);


module.exports=router;