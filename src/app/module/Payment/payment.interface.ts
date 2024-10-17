// Available payment methods
export type TPaymentMethod = 'SSL' | 'STRIPE' | 'PAYPAL';

// Payment structure
export type TPaymentInfo = {
  method: TPaymentMethod;
  subscriptionStatus: 'active' | 'inactive';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  cardInfo: ICardInfo
}

// Payment request for premium access
export type TPaymentRequest = {
  userId: string;
  amount: number;
  method: TPaymentMethod;
}

// Payment response after processing
export type TPaymentResponse = {
  paymentId: string;
  status: 'success' | 'failed';
  transactionDate: Date;
  amount: number;
  method: TPaymentMethod;
}

// Interface for Payment Info
export interface IPaymentInfo extends Document {
  method: TPaymentMethod;
  subscriptionStatus: 'active' | 'inactive';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  cardInfo?: ICardInfo; // Reference card info type
}

// Interface for Card Info
export interface ICardInfo extends Document {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}