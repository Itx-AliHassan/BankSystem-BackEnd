const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const sendEmail = require('../services/sendEmail.service')
const getLoginInfo = require('../services/getInfo.service')


/**
 * - Register User
 * - POST /api/auth/register
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    const isExists = await userModel.findOne({ email })

    if (isExists) return res.status(422).json({
        message: 'User already exists whit this email 😑',
        status: 'failed'
    })

    const user = await userModel.create({ name, email, password })

    await sendEmail({
        to: user.email,
        templateType: 'welcome-email',
        variables: {
            name: user.name,
            subject: 'Welcome to Our Website'
        }
    })

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRETS, { expiresIn: '7d' })
    res.cookie('token', token)

    res.status(201).json({
        message: 'user created successfully 😎',
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}

/**
 * - login User
 * - POST /api/auth/login
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select('+password')
    if (!user) return res.status(401).json({ message: 'Email Or password is Invalid 😵‍💫' })

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) return res.status(401).json({ message: 'Email Or password is Invalid 😵‍💫' })

    const loginInfo = getLoginInfo(req)

    await sendEmail({
        to: user.email,
        templateType: 'security-alert',
        variables: {
            name: user.name,
            subject: 'Someone just login to your Account',
            ip: loginInfo.ip,
            date: new Date().toLocaleString(),
            device: loginInfo.device,
            location: loginInfo.location,
        }
    })

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRETS, { expiresIn: '7d' })
    res.cookie('token', token)
    res.status(200).json({
        message: 'user login successfully 😎',
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}

module.exports = { registerUser, loginUser }