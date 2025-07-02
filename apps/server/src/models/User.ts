import { Schema, model, Document } from 'mongoose';

export interface IVerify extends Document {
  email: string;
  code?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  track: 'Operations' | 'Press' | 'Legislative' | 'All';
}

const VerifySchema = new Schema<IVerify>({
  email: {type: String, required: true},
  code: {type: String, required: true},
  createdAt: { type: Date, default: Date.now, expires: 600}
})

const UserSchema = new Schema<IUser>({
  email: {type: String, required: true},
  track: {type: String}
})

export const Verify = model<IVerify>('verify', VerifySchema)
export const User = model<IUser>('user', UserSchema)