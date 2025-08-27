import type { Document, Model, Types } from "mongoose";
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema<ITransaction>(
	{
		amount: {
			type: Number,
			description: "The amount of the transaction in cents.",
			required: true,
		},
		fromAccount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
			required: true,
			description: "The source account ID.",
		},
		toAccount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
			required: true,
			description: "The destination account ID.",
		},
	},
	{
		collection: "Transaction",
		timestamps: true,
	},
);

export type ITransaction = {
	amount: number;
	fromAccount: Types.ObjectId;
	toAccount: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model(
	"Transaction",
	TransactionSchema,
);
