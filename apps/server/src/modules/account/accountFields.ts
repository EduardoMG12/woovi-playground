import { AccountType, AccountConnection } from './AccountType';
import { AccountLoader } from './AccountLoader';
import { connectionArgs } from 'graphql-relay';
import { GraphQLID, GraphQLNonNull } from 'graphql';

export const accountField = (key: string) => ({
  [key]: {
    type: AccountType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (obj, { id }, context) => AccountLoader.load(context, id),
  },
});

export const accountConnectionField = (key: string) => ({
  [key]: {
    type: AccountConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (obj, args, context) => {
      return await AccountLoader.loadAll(context, args);
    },
  },
});
