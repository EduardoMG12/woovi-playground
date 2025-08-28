import type { Document, Model, Types } from 'mongoose';
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema<IAccount>(
  {
    ownerName: {
      type: String,
      description: 'The name of the account owner.',
      required: true,
    },
    balance: {
      type: Number,
      description:
        'The available balance of the account in cents (e.g., $10.50 is stored as 1050).',
      required: true,
      default: 0,
    },
  },
  {
    collection: 'Account',
    timestamps: true,
  },
);

export type IAccount = {
  ownerName: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const Account: Model<IAccount> = mongoose.model(
  'Account',
  AccountSchema,
);
