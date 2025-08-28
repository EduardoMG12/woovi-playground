import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { AccountLoader } from '../AccountLoader';
import { AccountType } from '../AccountType';
import { Account } from '../AccountModel';
import { errorField } from '../../error/errorFields';
import { Types } from 'mongoose';

type AccountDepositInput = {
  id: string;
  amount: number;
};

const mutation = mutationWithClientMutationId({
  name: 'AccountDeposit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  mutateAndGetPayload: async (args: AccountDepositInput) => {
    const { id, amount } = args;
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

    account.balance += amount;
    await account.save();

    return {
      account: account._id.toString(),
    };
  },
  outputFields: {
    account: {
      type: AccountType,
      resolve: async ({ account }) => Account.findById(account),
    },
  },
});

export const AccountDepositMutation = {
  ...mutation,
};
