const { Routes } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');

const transactionRoutes = Routes();

transactionRoutes.post('/', authMiddleware,);

module.exports = transactionRoutes;