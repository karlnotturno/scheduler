import { Schema, model, Document } from 'mongoose';

export interface IVerify extends Document {
  email: string;
  verify?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  verify?: string;
}

const UserSchema = new Schema<IVerify>({
  email: {type: String, required: true},
  verify: {type: String},
  // createdAt: { type: Date, default: Date.now, expires: 600}
})

export const User = model<IVerify>('User', UserSchema)