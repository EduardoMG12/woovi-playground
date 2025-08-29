import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';

import type { ITransaction } from './TransactionModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './TransactionLoader';
import { AccountLoader } from '../account/AccountLoader';
import { AccountType } from '../account/AccountType';

const TransactionType = new GraphQLObjectType<ITransaction>({
	name: 'Transaction',
	description: 'Represents a ledger transaction entry (debit or credit).',
	fields: () => ({
		id: globalIdField('Transaction'),
		amount: {
			type: GraphQLString,
			resolve: (transaction) => (transaction.amount / 100).toFixed(2),
		},
        type: {
            type: GraphQLString,
            resolve: (transaction) => transaction.type,
        },
        account: {
            type: AccountType,
            resolve: async (transaction, _, context) => AccountLoader.load(context, transaction.accountId),
        },
		createdAt: {
			type: GraphQLString,
			resolve: (transaction) => transaction.createdAt.toISOString(),
		},
        pair: {
            type: TransactionType,
            resolve: async (transaction, _, context) => {
                if (!transaction.pairId) {
                    return null;
                }
                return await TransactionLoader.load(context, transaction.pairId);
            },
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