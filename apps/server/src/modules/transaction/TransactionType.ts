import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import type { ITransaction } from './TransactionModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './TransactionLoader';
import { AccountLoader } from '../account/AccountLoader';
import { AccountType } from '../account/AccountType';

const TransactionType = new GraphQLObjectType<ITransaction>({
  name: 'Transaction',
  description: 'Represents a bank transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    amount: {
      type: GraphQLInt,
      resolve: (transaction) => transaction.amount,
    },
    fromAccount: {
      type: AccountType,
      resolve: async (transaction, _, context) =>
        AccountLoader.load(context, transaction.fromAccount),
    },
    toAccount: {
      type: AccountType,
      resolve: async (transaction, _, context) =>
        AccountLoader.load(context, transaction.toAccount),
    },
    createdAt: {
      type: GraphQLString,
      resolve: (transaction) => transaction.createdAt.toISOString(),
    },
  }),
  interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };
