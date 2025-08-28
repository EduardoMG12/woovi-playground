import { GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../transactionFields';
import { AccountLoader } from '../../account/AccountLoader';
import { Account } from '../../account/AccountModel';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { TransactionType } from '../TransactionType';
import { TransactionLoader } from '../TransactionLoader';

type TransactionAddInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
};

const mutation = mutationWithClientMutationId({
  name: 'TransactionAdd',
  inputFields: {
    fromAccountId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    toAccountId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  mutateAndGetPayload: async (args: TransactionAddInput, context) => {
    const { fromAccountId, toAccountId, amount } = args;

    const sourceAccountId = fromGlobalId(fromAccountId).id;
    const destinationAccountId = fromGlobalId(toAccountId).id;

    const fromAccount = await Account.findById(sourceAccountId);
    const toAccount = await Account.findById(destinationAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    const transaction = await new Transaction({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount,
    }).save();

    await fromAccount.save();
    await toAccount.save();

    redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
      transaction: transaction._id.toString(),
    });

    return {
      transaction: transaction._id.toString(),
    };
  },
  outputFields: {
    transaction: {
      type: TransactionType,
      resolve: async ({ transaction: id }, _, context) =>
        TransactionLoader.load(context, id),
    },
  },
});

export const TransactionAddMutation = {
  ...mutation,
};
