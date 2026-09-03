const express = require('express')
const { authMiddleware } = require('../middleware/auth.middleware')
const { createAccount } = require('../controllers/account.controller')

const route = express.Router()

route.post('/', authMiddleware, createAccount)

module.exports = route