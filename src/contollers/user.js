const express= require('express');
const Aircraft = require('../models/airplane.js');
const Flight=require('../models/flight.js');
const Airport =require('../models/airport.js');
const User=require('../models/user.js');
const router=express.Router();


const Users = require('../models/user.js');
const { body, validationResult }=require('express-validator');
const bcrypt = require('bcrypt');
// import { body, validationResult } from "express-validator";


const register = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }
        const existing = await User.findOne({ email: req.body.email })
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already in use' })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            // role: req.body.role,
            passwordHash: hashedPassword
        
        })

        

        
        
        await user.save()
        res.status(201).json({ success: true, data: { id: user, name: user.name, email: user.email } })
    }
    catch(err) {
        res.status(500).json({ success: false, message: err.message })
       
    }
}

module.exports = { register }