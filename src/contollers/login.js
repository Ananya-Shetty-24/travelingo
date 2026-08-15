
const User=require('../models/user.js');
const express= require('express');
const Aircraft = require('../models/airplane.js');
const Flight=require('../models/flight.js');
const Airport =require('../models/airport.js');
const router=express.Router();

const { body, validationResult }=require('express-validator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');



const login = async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user) return res.status(400).json({message:"invalid credentials"});
    const isMatch=await bcrypt.compare(password, user.passwordHash);
    if(!isMatch) return res.status(400).json({message:"invalid"});
    const payload = { id: user._id, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:"server error"})
  }
};


module.exports= { login }