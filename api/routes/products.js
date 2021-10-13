const express = require('express');
const router = express.Router();

const { requireLogin } = require('../middlewares/authentication');
const { uploadMiddleware } = require('../middlewares/upload');

// We use the corresponding controller here to handle the product resource
// Now the routes are simply doing that: re-rerouting the request (including all of their context) to the corresponding controller.
const ProductController = require('../controllers/product');

router.use(requireLogin);

// Create
router.post("/", uploadMiddleware.single('photo'), ProductController.createProduct);

// Read one
router.get('/:id', ProductController.getProduct);

// Read all
router.get('/', ProductController.getAllProducts);

// Update
router.put('/:id', uploadMiddleware.single('photo'), ProductController.updateProduct);

// Delete
router.delete('/:id', ProductController.deleteProduct);

// Get image
router.get('/images/:photoPath', ProductController.getProductImage);

module.exports = router;