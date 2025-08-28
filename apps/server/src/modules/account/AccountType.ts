import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLInt,
} from "graphql";
import { globalIdField, connectionDefinitions } from "graphql-relay";
import type { ConnectionArguments } from "graphql-relay";

import type { IAccount } from "./AccountModel";
import { nodeInterface } from "../node/typeRegister";
import { registerTypeLoader } from "../node/typeRegister";
import { AccountLoader } from "./AccountLoader";

const AccountType = new GraphQLObjectType<IAccount>({
	name: "Account",
	description: "Represents a bank account",
	fields: () => ({
		id: globalIdField("Account"),
		ownerName: {
			type: GraphQLString,
			resolve: (account) => account.ownerName,
		},
		balance: {
			type: GraphQLInt,
			resolve: (account) => account.balance,
		},
	}),
	interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
	name: "Account",
	nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };
