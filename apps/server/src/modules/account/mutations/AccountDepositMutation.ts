import { GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { AccountType } from '../AccountType';
import { Account } from '../AccountModel';
import { errorField } from '../../error/errorFields';
import { depositToAccount } from './AccountService';

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
        try {
            await depositToAccount(args.id, args.amount);

            return {
                account: args.id,
            };
        } catch (error) {
            return {
                error: error.message,
            };
        }
    },
    outputFields: {
        account: {
            type: AccountType,
            resolve: async ({ account: id }) => {
                const { id: accountId } = fromGlobalId(id);
                return Account.findById(accountId);
            },
        },
        ...errorField('error'),
    },
});

export const AccountDepositMutation = {
    ...mutation,
};