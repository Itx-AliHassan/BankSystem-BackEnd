const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        require: [true, 'Transaction must be associate with a from account']
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        require: [true, 'Transaction must be associate with a to account']
    },
    status: {
        type: String,
        enum: {
            value: ['PENDING', 'COMPLETE', 'FAILED', 'REVERSED'],
            message: 'Status can be either be PENDING, COMPLETE, FAILED or REVERSED'
        },
        default: 'PENDING'
    },
    amount: {
        type: Number,
        required: [true, 'An amount is required to make the transaction'],
        min: [0, "amount can't be negative or zero"]
    },
    idempotencyKey: {
        type: String,
        required: [true, 'IdempotencyKey is required to make an transaction'],
        index: true,
        unique: true
    }
}, { timestamps: true })

const transactionModel = mongoose.model('transaction', transactionSchema)

module.exports = transactionModel