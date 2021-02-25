// loading environment variables from .env file
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
// connecting to mongodb server
require('./database')
// mongoose models
require('./models')

const cors = require('cors')
const express = require('express')

// routes
const { authRoutes, productRoutes } = require('./routes')

const app = express()

// setup cors
app.use(cors())
// using express's bodyparser implementation
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// using multer to store files
app.use(require('./storage'))

app.use(authRoutes)
app.use('/listings', productRoutes)

// 404 - Not Found route handler
app.use((req, res) => {
    res.status(404).json({ message: `${req.url} not found` })
})

// custom error middleware
app.use((error, req, res, next) => {
    const code = error.code || 500
    const message = error.message || 'Something went wrong, please try again'
    res.status(code).json({ message })
})

app.listen(process.env.PORT, () =>
    console.log(`go to http://localhost:${process.env.PORT}`)
)
