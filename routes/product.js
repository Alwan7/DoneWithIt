const express = require('express')
const mongoose = require('mongoose')
const { generateError } = require('../utils')

// mongoose models
const Product = mongoose.model('product')

const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { categoryId, description, price, title } = req.body
        const images = req.files.map((file) => file.filename)

        const location = req.body.location
            ? JSON.parse(req.body.location)
            : null

        const product = new Product({
            categoryId,
            description,
            price,
            title,
            images,
        })
        if (location) product.location = location

        await product.save()

        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const { categoryId, description, title, price } = req.body
        const images = req.files.map((image) => image.filename)
        const location = req.body.location
            ? JSON.parse(req.body.location)
            : null

        const product = await Product.findById(id)
        if (!product) throw generateError(404, 'product not found')

        if (categoryId) product.categoryId = categoryId
        if (description) product.description = description
        if (price) product.price = price
        if (title) product.title = title
        if (images.length > 0) product.images = images
        if (location) product.location = location

        await product.save()

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)
        if (!product) throw generateError(404, 'product not found')

        await product.remove()

        res.status(200).end()
    } catch (error) {
        next(error)
    }
})

module.exports = router
