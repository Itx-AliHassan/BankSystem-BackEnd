const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) return res.status(401).json({
        message: 'Unauthorize, no token found'
    })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETS)
        const user = await userModel.findById(decoded.userID)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorize access,token is invalid',
            error
        })
    }
}

module.exports = { authMiddleware }