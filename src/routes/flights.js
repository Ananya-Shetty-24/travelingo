const express= require('express');
const router=express.Router();
const { syncFlights } = require('../services/aviationstack');
const { searchFlights }=require('../contollers/search');
const { id }=require('../contollers/id');

router.get('/',(req,res,next)=>{
    res.send("flights route working");
});

router.get("/search",searchFlights);
router.get("/id",id);

module.exports=router;