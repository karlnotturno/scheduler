import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  verify?: string;
}

const UserSchema = new Schema<IUser>({
  email: {type: String, required: true},
  verify: {type: String}
})

export const User = model<IUser>('User', UserSchema);