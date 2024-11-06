import mongoose, { Schema, Document } from "mongoose";
import { ICardInfo, IPaymentInfo, TPaymentMethod } from "./payment.interface";

// Define CardInfoSchema
export const CardInfoSchema: Schema = new Schema(
  {
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  { _id: false }
);

// Define PaymentInfoSchema and reference CardInfoSchema
export const PaymentInfoSchema: Schema<IPaymentInfo> = new Schema<IPaymentInfo>(
  {
    method: { type: String, required: true },
    subscriptionStatus: { type: String, required: true },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    cardInfo: { type: CardInfoSchema, default: null }, // Reference CardInfoSchema
  },
  { _id: false }
);

// Export the main model if this is part of a larger document
export const PaymentInfo = PaymentInfoSchema;
export const CardInfo = CardInfoSchema;
