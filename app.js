const express = require('express');
const mongoose = require('mongoose');
const app = express();

// We connect to Mongo here
const { mongoUrl } = require('./config');
console.log("Connecting to " + mongoUrl);
// This long line is to avoid showing the warnings, otherwise we can do mongoose.connect(mongoUrl);
mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () { console.log('Connected to database server'); });

// To handle data in post requests
app.use(express.json())

// We load the index.js of the api folder. 
// The idea is to use that to configure all possible routes for our app (the ones regarding resources)
app.use(require('./api'));

module.exports = app;