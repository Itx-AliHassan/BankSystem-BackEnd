const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const sendEmail = require('../services/sendEmail.service');
const mongoose = require('mongoose');

const createTransaction = async (req, res) => {
    const { fromAccount, toAccount, amount, idempotentKey } = req.body
    if (!fromAccount || !toAccount || !amount || !idempotentKey) return res.status(400).json({ message: 'fromAccount, toAccount, amount, and idempotentKey are required' });

    const fromAccountData = await accountModel.findById(fromAccount);
    const toAccountData = await accountModel.findById(toAccount);

    if (!fromAccountData || !toAccountData) return res.status(400).json({ message: 'Invalid account(s) ID' });

    const isTransactionExists = await transactionModel.findOne({ idempotentKey });
    if (isTransactionExists) {
        if (isTransactionExists.status === 'COMPLETE') return res.status(200).json({ message: 'Transaction already processed successfully', transaction: isTransactionExists });
        if (isTransactionExists.status === 'FAILED') return res.status(400).json({ message: 'Transaction failed previously' });
        if (isTransactionExists.status === 'PENDING') return res.status(500).json({ message: 'Transaction is being processed' });
        if (isTransactionExists.status === 'REVERSED') return res.status(400).json({ message: 'Transaction was reversed' });
    }

    if (fromAccountData.status !== 'ACTIVE' || toAccountData.status !== 'ACTIVE') return res.status(400).json({ message: 'Both account must be Active to process transaction' })

    const fromAccountBalance = await fromAccountData.getBalance();
    if (fromAccountBalance < amount) return res.status(400).json({ message: `Insufficient balance. Current balance is ${fromAccountBalance}. Requested amount is ${amount}` });

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotentKey,
        status: 'PENDING'
    }, { session })

    const debitLedgerEntry = await ledgerModel({
        account: fromAccount,
        type: 'DEBIT',
        amount,
        transaction: transaction._id
    }, { session })

    const creditLedgerEntry = await ledgerModel({
        account: fromAccount,
        type: 'CREDIT',
        amount,
        transaction: transaction._id
    }, { session })

    transaction.status = 'COMPLETE'
    await transaction.save({ session })

    await session.commitTransaction();
    session.endSession();

    const date = new Date().toISOString();

    sendEmail({
        to: fromAccountData.user.email,
        templateType: 'money-send',
        variables: {
            subject: `you just transferred money to ${toAccountData.name} 💸`,
            date,
            amount,
            receiver: toAccountData.name,
            transactionId: transaction._id.toString(),
            name: fromAccountData.user.name,
        }
    })

    sendEmail({
        to: toAccountData.user.email,
        variables: {
            subject: `you just Received money from ${fromAccountData.name} 🤑`,
            date,
            amount,
            sender: fromAccountData.name,
            transactionId: transaction._id.toString(),
            name: toAccountData.user.name,
        }
    })

    return res.status(200).json({ message: 'Transaction successful', transaction });
}

module.exports = { createTransaction }