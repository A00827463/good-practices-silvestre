var appRoot = require('app-root-path');
const { reportsPhotoFolder } = require('../config');
const fs = require('fs');
const path = require('path');
const ProductModel = require('../models/Product');

// Now this service is providing whatever is needed to interact with the database but at the same time
// validating the BLL requirements.

const createProduct = async (name, price, file) => {
    // there was an attached file!
    const product = new ProductModel({ name: name, price: price });

    if (file) product.photoPath = file.filename;

    // All validation, checks, further tasks (sending emails, etc.) must happen here.
    const newProduct = await product.save();
    return newProduct;
};

const getProduct = async (id) => {
    const product = await ProductModel.findById(id);
    // const product = await ProductModel.findOne({_id = id});
    // const product = await ProductModel.findById(id).select("name price");
    // const product = await ProductModel.findById(id, "name price");
    return product;
};

const getAllProducts = async () => {
    const products = await ProductModel.find({});
    // const products = await ProductModel.find({}).select("name price"); 
    // or
    // const products = await ProductModel.find({}, "name price");
    return products;
};

const updateProduct = async (id, name, price, file, keepPhoto) => {
    const product = await ProductModel.findById(id);
    product.name = name;
    product.price = price;

    const previousPicture = product.photoPath
    let removePhoto = false;


    if (file) {
        // User uploaded an image, this will overwrite the previous image
        product.photoPath = file.filename;
    } else {
        // User did not upload an image, here it might mean to drop the image, keepPhoto will tell
        if (!keepPhoto) {
            product.photoPath = null;
            removePhoto = true;
        }
    }

    await product.save();
    if (removePhoto) deletePhoto(previousPicture)
    return product;
}

const deleteProduct = async (id) => {
    const product = await ProductModel.findOneAndDelete({ _id: id });
    if (product.photoPath) {
        deletePhoto(product.photoPath);
    }
    return product;
}

function deletePhoto(photoPath) {
    let fullPath = path.join(appRoot + `/${reportsPhotoFolder}/` + photoPath)
    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error(`Error when deleting photo from fs ${err.message}`)
        } else {
            console.log(`Photo ${photoPath} deleted successfully`);
        }
    })
}

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
};
