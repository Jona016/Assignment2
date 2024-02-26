import Product from '../models/product.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'
const create = async (req, res) =>{
    const product = new Product(req.body)
    try{
        await product.save()
        return res.status(200).json({
            message: "Successfully added!"
        })
    }
    catch (err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) =>{
    try {
        let product = await Product.find().select ('name description price quantity category')
        res.json(product)
    }
    catch (err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const productByID = async (req, res, next, id) => {
    try {
        let product = await Product.findById(id);
        if (!product)
            return res.status(404).json({
                error: "Product not found"
            });
        req.profile = product;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve product"
        });
    }
}

const productByName = async (req, res) => {
    try {
        const substring = req.query.name;
        const allProducts = await Product.find();
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(substring.toLowerCase())
        );

        res.send(filteredProducts);
    } catch (err) {
        console.error('Error retrieving products:', err);
        res.status(500).send({
            message: "Could not retrieve product"
        });
    }
};


const read = (req, res) => {
    return res.json(req.profile)
}

const update = async (req, res) => {
    try {
        let product = req.profile
        product = extend(product, req.body)
        product.updated = Date.now()
        await product.save()
        res.json (product)
    }
    catch (err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try {
        let product = req.profile;
        const deletedProduct = await Product.deleteOne({ _id: product._id });

        res.json(deletedProduct);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const removeAll = async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        
        res.json(result);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

export default {create, productByID, read, list, remove, update, productByName, removeAll}