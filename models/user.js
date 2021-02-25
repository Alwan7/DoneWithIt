const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(12)
            const hash = await bcrypt.hash(user.password, salt)
            user.password = hash
            next()
        } catch (error) {
            next(error)
        }
    }
})

userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this
    return new Promise(async (resolve, reject) => {
        try {
            const matched = await bcrypt.compare(
                candidatePassword,
                user.password
            )
            resolve(matched)
        } catch (error) {
            reject(error)
        }
    })
}

mongoose.model('user', userSchema)
