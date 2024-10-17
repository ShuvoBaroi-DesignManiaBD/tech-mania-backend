import mongoose, { Schema, Document } from "mongoose";
import { ICardInfo, IPaymentInfo, TPaymentMethod } from "./payment.interface";


// Define CardInfoSchema
export const CardInfoSchema: Schema = new Schema({
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
}, { _id: false });

// Define PaymentInfoSchema and reference CardInfoSchema
export const PaymentInfoSchema: Schema = new Schema({
  method: { type: String, enum: ['SSL', 'STRIPE', 'PAYPAL'], required: true },
  subscriptionStatus: { type: String, enum: ['active', 'inactive'], required: true },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
  cardInfo: { type: CardInfoSchema, default: null },  // Reference CardInfoSchema
}, { _id: false });

// Create models for PaymentInfo and CardInfo
export const PaymentInfo = mongoose.model<IPaymentInfo>('Payment', PaymentInfoSchema);
export const CardInfo = mongoose.model<ICardInfo>('CardInfo', CardInfoSchema);
