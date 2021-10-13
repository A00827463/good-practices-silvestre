/***
 * This file connects with all possible routes handling resources in our server.
 * In this example, we are just using the routes for products.
 * More routes could be added following the same idea.
 * Here, each resource is inside the routes folder.
 */
const express = require('express');
const router = express.Router();

router.use('/products', require('./routes/products'));

router.use('/reports', require('./routes/reports'));

router.use('/users', require('./routes/users'));

module.exports = router;