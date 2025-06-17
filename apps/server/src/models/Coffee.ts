import mongoose, { Schema, model, Document } from 'mongoose';

export interface ICoffee extends Document {
  requesterName: string;
  requesterEmail: string;
  requestedTime: Date;
  requestedLocation: 'Longworth' | 'Rayburn' | 'Cannon';
}

const CoffeeSchema = new Schema<ICoffee>({
  requesterName: {type: String, required: true},
  requesterEmail: {type: String, required: true},
  requestedTime: {type: Date, required: true},
  requestedLocation: {type: String, required: true}
})

export const Coffee = model<ICoffee>('Coffee', CoffeeSchema);