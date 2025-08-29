import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema<IAccount>(
  {
    ownerName: {
      type: String,
      description: 'The name of the account owner.',
      required: true,
    },
  },
  {
    collection: 'Account',
    timestamps: true,
  },
);

export type IAccount = {
  ownerName: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const Account: Model<IAccount> = mongoose.model(
  'Account',
  AccountSchema,
);
