import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../../domain/entities/User";

interface IUserDocument extends Document, User {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
      fullName: { 
        type: String, 
        required: true 
    },
      email: { 
        type: String, 
        required: true, 
        unique: true 
    },
      mobileNumber: { 
        type: String, 
        required: true 
    },
      password: { 
        type: String, 
        required: true 
    },
    role: { 
      type: String, 
      enum: ["user", "doctor", "admin"], 
      default: "user", 
      required: true 
    },
},
{
  timestamps: true, 
}
);

export default mongoose.model<IUserDocument>("User", UserSchema);
