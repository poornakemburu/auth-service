import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for Certificate (embedded document)
interface ICertificate {
  filename: string;
  contentType: string;
  data: Buffer;
}

// Interface for Coach document
export interface ICoach extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  profilePic: string;
  rating: number;
  title: string;
  about: string;
  type: string; // e.g., Yoga, CrossFit
  specialization: string[]; // e.g., ['Rehabilitation', 'Flexibility']
  certificates: ICertificate[];
}

// Certificate sub-schema
const certificateSchema = new Schema<ICertificate>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true }
});

// Main Coach schema
const coachSchema = new Schema<ICoach>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 30
    },
    profilePic: {
      type: String, // could be a file path or a URL
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true
    },
    about: {
      type: String,
      required: true,
      maxlength: 1000
    },
    type: {
      type: String,
      required: true
    },
    specialization: {
      type: [String],
      default: []
    },
    certificates: {
      type: [certificateSchema],
      default: []
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

// Add virtual 'id' for frontend convenience
coachSchema.virtual('id').get(function (this: ICoach) {
  return this._id.toString();
});

// Export model
const Coach = mongoose.model<ICoach>('Coach', coachSchema);
export default Coach;
