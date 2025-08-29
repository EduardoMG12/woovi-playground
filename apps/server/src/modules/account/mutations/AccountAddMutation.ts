import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { AccountType } from '../AccountType';
import { AccountLoader } from '../AccountLoader';
import { errorField } from '../../error/errorFields';
import { createAccount } from './AccountService';

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
    try {
      const account = await createAccount(args.ownerName);

      redisPubSub.publish(PUB_SUB_EVENTS.ACCOUNT.ADDED, {
        account: account._id.toString(),
      });

      return {
        account: account._id.toString(),
      };
    } catch (error) {
      throw new Error(error.message)
    }
  },
  outputFields: {
    account: {
      type: AccountType,
      resolve: async ({ account: id }, _, context) =>
        AccountLoader.load(context, id),
    },
    ...errorField('error'),
  },
});

export const AccountAddMutation = {
  ...mutation,
};