import { TransactionType, TransactionConnection } from './TransactionType';
import { TransactionLoader } from './TransactionLoader';
import { connectionArgs } from 'graphql-relay';
import { GraphQLID, GraphQLNonNull } from 'graphql';

export const transactionField = (key: string) => ({
  [key]: {
    type: TransactionType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (obj, { id }, context) =>
      TransactionLoader.load(context, id),
  },
});

export const transactionConnectionField = (key: string) => ({
  [key]: {
    type: TransactionConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (obj, args, context) => {
      return await TransactionLoader.loadAll(context, args);
    },
  },
});
