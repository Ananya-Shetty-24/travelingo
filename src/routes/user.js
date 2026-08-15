const express= require('express');
const router=express.Router();



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





module.exports=router;
