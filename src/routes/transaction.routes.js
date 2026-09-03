const { Routes } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { createTransaction } = require('../controllers/transaction.controller');

const transactionRoutes = Routes();

transactionRoutes.post('/', authMiddleware, createTransaction);

module.exports = transactionRoutes;