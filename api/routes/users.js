const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middlewares/authentication');

// We use the corresponding controller here to handle the product resource
// Now the routes are simply doing that: re-rerouting the request (including all of their context) to the corresponding controller.
const UserController = require('../controllers/user');

// Login
router.post("/login", UserController.login);

// Create
router.post("/", UserController.createUser);

// Read all
router.get('/', requireLogin, UserController.getUsers);

// Read one
router.get('/:id', requireLogin, UserController.getUser);

// Update user
router.put('/:id', requireLogin, UserController.updateUser);

// // Update user [ass]
// router.put('/:id', requireLogin, UserController.updateUserPassword);

module.exports = router;