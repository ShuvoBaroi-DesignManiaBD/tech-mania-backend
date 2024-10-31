import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { IUser, UserModel } from './user.interface';
import { PaymentInfoSchema } from '../Payment/payment.model';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    verified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    paymentInfo: { type: PaymentInfoSchema, default: null },
  },
  { timestamps: true },
);

// hashing password and save into DB by pre-hook middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Instance method for checking if the user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email });
};

// Instance method for checking if the user exists by ID
userSchema.statics.isUserExistsById = async function (id: string) {
  return await this.findById(id);
};

// Instance method for checking if passwords match
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Instance method for checking if JWT is issued before password change
userSchema.methods.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  if (!passwordChangedTimestamp) return false;
  const passwordChangedAt = new Date(passwordChangedTimestamp).getTime() / 1000;
  return jwtIssuedTimestamp < passwordChangedAt;
};

export const User = model<IUser, UserModel>('User', userSchema);
