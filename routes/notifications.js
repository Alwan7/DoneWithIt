const express = require('express')

const { requireAuth } = require('../middlewares')
const { sendNotification } = require('../controllers')

const router = express.Router()

router.use(requireAuth)

router.post('/', sendNotification)

module.exports = router