import { GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { TransactionType } from '../TransactionType';
import { errorField } from '../../error/errorFields';
import { addTransaction } from './TransactionService';
import { Transaction } from '../TransactionModel';

type TransactionAddInput = {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
};

const mutation = mutationWithClientMutationId({
    name: 'TransactionAdd',
    inputFields: {
        fromAccountId: { type: new GraphQLNonNull(GraphQLID) },
        toAccountId: { type: new GraphQLNonNull(GraphQLID) },
        amount: { type: new GraphQLNonNull(GraphQLInt) },
    },
    mutateAndGetPayload: async (args: TransactionAddInput) => {
        try {
            const transaction = await addTransaction(args);

            return {
                transaction: transaction._id.toString(),
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    outputFields: {
        transaction: {
            type: TransactionType,
            resolve: async ({ transaction: id }) => Transaction.findById(id),
        },
        ...errorField('error'),
    },
});

export const TransactionAddMutation = {
    ...mutation,
};