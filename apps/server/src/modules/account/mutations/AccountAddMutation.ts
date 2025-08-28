import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Account } from '../AccountModel';
import { accountField } from '../accountFields';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { AccountType } from '../AccountType';
import { AccountLoader } from '../AccountLoader';

export type AccountAddInput = {
  ownerName: string;
};

const mutation = mutationWithClientMutationId({
  name: 'AccountAdd',
  inputFields: {
    ownerName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: AccountAddInput) => {
    const account = await new Account({
      ownerName: args.ownerName,
    }).save();

    redisPubSub.publish(PUB_SUB_EVENTS.ACCOUNT.ADDED, {
      account: account._id.toString(),
    });

    return {
      account: account._id.toString(),
    };
  },
  outputFields: {
    account: {
      type: AccountType,
      resolve: async ({ account: id }, _, context) =>
        AccountLoader.load(context, id),
    },
  },
});

export const AccountAddMutation = {
  ...mutation,
};
