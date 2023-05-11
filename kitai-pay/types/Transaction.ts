export interface ITransaction {
  _id: string;
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  date: string;
  token: string;
}
