import { Schema, model, Document, Types } from 'mongoose';

export interface ISport extends Document {
  name: string;
  type: 'team' | 'individual';
  rules?: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const sportSchema = new Schema<ISport>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the sport name'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['team', 'individual'],
      default: 'team',
    },
    rules: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

sportSchema.index({ isDeleted: 1, status: 1 });

export const Sport = model<ISport>('Sport', sportSchema);
export default Sport;
