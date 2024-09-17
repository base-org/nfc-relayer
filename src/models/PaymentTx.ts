import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTx extends Document {
  uuid: string;
  data: {
    toAddress: string;
    chainId: number;
    amount: string;
    contractId: string;
  };
}

const PaymentTxSchema: Schema = new Schema({
  uuid: { type: String, required: true, unique: true },
  data: {
    toAddress: { type: String, required: true },
    chainId: { type: Number, required: true },
    amount: { type: String, required: true },
    contractId: { type: String, required: true },
  },
});

export default mongoose.model<IPaymentTx>('PaymentTx', PaymentTxSchema);