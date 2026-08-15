require('dotenv').config();
const mongoose = require('mongoose');
const Aircraft = require('./src/models/airplane.js');
const Flight=require('.src/models/flight.js');

// Replace this with your actual Atlas connection string
mongoose.connect(process.env.dburi)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Create and save a test document
    const testAircraft = new Aircraft({
      // fill in fields based on your schema
      name: 'Test Plane',
      modelName: 'Boeing 737',
      seatNumber:32,
      totalSeats:100,
      class:'business',
      isAvaillable: true,


    });

    await testAircraft.save();
    console.log('Aircraft saved:', testAircraft);

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

// Don't put any keys in code. See https://docs.stripe.com/keys-best-practices.
// Find your keys at https://dashboard.stripe.com/apikeys.
const stripes = require('stripe')(process.env.TEST);

const paymentIntent = await stripes.paymentIntents.create({
  amount: 500,
  currency: 'gbp',
  payment_method: 'pm_card_visa',
  payment_method_types: ['card'],
});