import type { Document, Model, Types } from 'mongoose';
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema<ITransaction>(
    {
        amount: {
            type: Number,
            description: 'The amount of the transaction in cents.',
            required: true,
        },
        type: {
            type: String,
            enum: ['debit', 'credit'],
            required: true,
            description: 'The type of the transaction (debit or credit).',
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
            description: 'The account related to this transaction.',
        },
        pairId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            description: 'The ID of the paired transaction (for double-entry bookkeeping).',
        },
        description: {
            type: String,
            description: 'A description for the transaction.',
        },
    },
    {
        collection: 'Transaction',
        timestamps: true,
    },
);

export type ITransaction = {
    amount: number;
    type: 'debit' | 'credit';
    accountId: Types.ObjectId;
    pairId?: Types.ObjectId;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model(
    'Transaction',
    TransactionSchema,
);