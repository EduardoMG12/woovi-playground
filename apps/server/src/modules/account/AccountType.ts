import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLFloat } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';

import type { IAccount } from './AccountModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';
import { Transaction } from '../transaction/TransactionModel';

const AccountType = new GraphQLObjectType<IAccount>({
    name: 'Account',
    description: 'Represents a bank account',
    fields: () => ({
        id: globalIdField('Account'),
        ownerName: {
            type: GraphQLString,
            resolve: (account) => account.ownerName,
        },
        balance: {
            type: GraphQLFloat,
            resolve: async (account) => {
                const transactions = await Transaction.find({ accountId: account._id });

                let balance = 0;
                transactions.forEach((t) => {
                    if (t.type === 'credit') {
                        balance += t.amount;
                    } else if (t.type === 'debit') {
                        balance -= t.amount;
                    }
                });

                return (balance / 100).toFixed(2);
            },
        },
    }),
    interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
    name: 'Account',
    nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };