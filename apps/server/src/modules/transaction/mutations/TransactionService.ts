import { fromGlobalId } from 'graphql-relay';
import { Types } from 'mongoose';
import { Transaction } from '../TransactionModel';
import { Account } from '../../account/AccountModel';

export async function addTransaction({ fromAccountId, toAccountId, amount }) {
    const sourceAccountId = fromGlobalId(fromAccountId).id;
    const destinationAccountId = fromGlobalId(toAccountId).id;

    if (!Types.ObjectId.isValid(sourceAccountId) || !Types.ObjectId.isValid(destinationAccountId)) {
        throw new Error('Invalid Account ID');
    }

    const fromAccount = await Account.findById(sourceAccountId);
    const toAccount = await Account.findById(destinationAccountId);

    if (!fromAccount || !toAccount) {
        throw new Error('Account not found');
    }

    if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
    }

    const fromAccountTransactions = await Transaction.find({ accountId: fromAccount._id });
    const fromAccountBalance = fromAccountTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'debit') return acc - transaction.amount;
        return acc + transaction.amount;
    }, 0);

    if (fromAccountBalance < amount) {
        throw new Error('Insufficient balance');
    }

    const debitTransaction = await new Transaction({
        type: 'debit',
        accountId: fromAccount._id,
        amount,
    }).save();

    const creditTransaction = await new Transaction({
        type: 'credit',
        accountId: toAccount._id,
        amount,
        pairId: debitTransaction._id,
    }).save();

    debitTransaction.pairId = creditTransaction._id;
    await debitTransaction.save();

    return creditTransaction;
}