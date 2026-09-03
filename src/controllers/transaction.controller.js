const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const sendEmail = require('../services/sendEmail.service');

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
}

module.exports = { createTransaction }