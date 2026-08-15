const express= require('express');
const router=express.Router();

// const Aircraft = require('../models/airplane.js');
// const Flight=require('../models/flight.js');
// const Airport =require('../models/airport.js');
// const User=require('../models/user.js');


// router.post('/register',async(req,res)=>{
//     try{
//         const user1= new User({
//             name:req.body.name,
//             email:req.body.email,
//             role:req.body.role,
//             password:req.body.password
//         });
//         await user1.save();
//         res.send({ success: true, data: { id, name, email } });
//     }
//     catch(err){
//         console.error('Error saving user data:', err);
//         res.status(500).render('index', { error: 'Error saving user data' });
//     }


// });

// module.exports=router;


const { register } = require('../contollers/user');
const { login } = require('../contollers/login');
const { body, validationResult }=require('express-validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/user.js');

router.post('/register', [
    body("name").notEmpty().withMessage("Name is required"),
    
      // Validate email
    body("email").isEmail().withMessage("Invalid email address"),
    
      // Validate password
    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
],register);

router.post('/login',login);

// router.post('/login',async(req,res)=>{
//   try{
//     const {email,password}=req.body;
//     const user2= await User.findOne({email});
//     if(!user2) return res.status(400).json({message:"invalid"});
//     const isMatch=await bcrypt.compare(password,req.password);
//     if(!isMatch) return res.status(400).json({message:"invalid"});
//     const payload = { id: user._id, email: user.email };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

//     res.json({ token });
//   }
//   catch(err){
//     res.status(500).json({message:"server error"})
//   }
// });



module.exports=router;