import { Account } from '../AccountModel';
import { Transaction } from '../../transaction/TransactionModel';
import { fromGlobalId } from 'graphql-relay';
import { Types } from 'mongoose';

export async function createAccount(ownerName: string) {
  if (ownerName.length <= 1) {
    throw new Error('ownerName must be longer than 1 character');
  }

  const account = await new Account({ ownerName }).save();
  return account;
}

export async function depositToAccount(id: string, amount: number) {
  const accountId = fromGlobalId(id).id;

  if (!Types.ObjectId.isValid(accountId)) {
    throw new Error('Invalid Account ID');
  }

  const account = await Account.findById(accountId);

  if (!account) {
    throw new Error('Account not found');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  const creditTransaction = await new Transaction({
    type: 'credit',
    accountId: account._id,
    amount: amount,
    description: 'Deposit',
  }).save();

  return account;
}