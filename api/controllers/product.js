const ProductService = require('../../services/product');

// Now the controller is using the services associated to the product resource.
// Here, we use the req,res, extracting whatever the service needs to work.

module.exports = {
    createProduct: async (req, res, next) => {
        // Notice our app declared app.use(express.json()); for doing this

        // This is for sep attributes (postman)
        // let { name, price,photoPath } = req.body;
        // This is for single json field product (android)
        let { name, price } = JSON.parse(req.body.product);

        try {
            // Do not forget the await keyword otherwise you get a promise rather than an object
            const product = await ProductService.createProduct(name, price, req.file)
            res.status(201).json(product); // 201: Created
        } catch (err) {
            res.status(500).json({ "message": `error: ${err.message}` });
            console.log(err.message);
        }
    },

    getProduct: async (req, res, next) => {
        const productId = req.params.id;
        try {
            const product = await ProductService.getProduct(productId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ "message": "NotFound" }); // 404: Not found
            }
        } catch (err) {
            res.status(500).json({ "message": `Request for id ${productId} caused an error` });
            console.log(err.message);
        }
    },

    getAllProducts: async (req, res, next) => {
        try {
            const products = await ProductService.getAllProducts();
            res.json(products);
        } catch (err) {
            res.status(500).end(`Request for all products caused an error`);
            console.log(err.message);
        }
    },

    updateProduct: async (req, res, next) => {
        const productId = req.params.id;
        const { name, price } = JSON.parse(req.body.product);
        const { keepPhoto } = req.body;
        try {
            const product = await ProductService.getProduct(productId);
            if (product) {
                const updatedProduct = await ProductService.updateProduct(productId, name, price, req.file, keepPhoto)
                res.json(updatedProduct);
            } else {
                res.status(404).json({ "message": `Product with id ${productId} does not exist` });
                console.log(`Product with id ${productId} does not exist`);
            }
        } catch (err) {
            res.status(500).end(`Request for updating productId ${productId} caused an error ${err.message}`);
        }
    },

    deleteProduct: async (req, res, next) => {
        const productId = req.params.id;
        try {
            const product = await ProductService.deleteProduct(productId);
            res.json(product);
        } catch (err) {
            res.status(500).json({ "message": `Request for deleting productId ${productId} caused an error` });
            console.log(err.message);
        }
    },

    getProductImage: async (req, res, next) => {
        // ! This is a violation for our controller scope, as we are accessing to file system right here.
        // ! It is possible to do it in the service, reading the file as bytes and constructing the content-type.
        // ! For didactic purposes, we can do it right here, but we know this should be in the service file
        let photoPath = req.params.photoPath;
        const path = require('path');
        var appRoot = require('app-root-path');
        const { reportsPhotoFolder } = require('../../config');
        let fullPath = path.join(appRoot + `/${reportsPhotoFolder}/` + photoPath);
        res.sendFile(fullPath);
    }
};