const userModel = require('../models/user.model')

/**
 * - Register User
 * - POST /api/auth/register
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    const isExists = await userModel.findOne({ email })

    if (isExists) return res.status(422).json({
        message: 'User already exists whit this email.',
        status: 'failed'
    })

    const user = await userModel.create({ name, email, password })
}


module.exports = { registerUser }