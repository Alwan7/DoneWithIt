const mongoose = require('mongoose')

const { generateError, generateToken } = require('../utility')

// models
const User = mongoose.model('user')

exports.login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user)
            throw generateError(
                404,
                'This email is not associated with any account'
            )

        const matched = await user.comparePassword(password)
        if (!matched) throw generateError(400, 'Wrong password')

        const token = generateToken({
            id: user._id,
            name: user.name,
            email: user.email,
        })

        res.status(200).send(token)
    } catch (error) {
        next(error)
    }
}

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser)
            throw generateError(400, 'This email is associated with an account')

        const user = new User({ name, email, password })
        await user.save()

        const token = generateToken({
            id: user._id,
            name: user.name,
            email: user.email,
        })

        res.status(201).send(token)
    } catch (error) {
        next(error)
    }
}
