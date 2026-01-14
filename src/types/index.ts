export type TransactionType = 'income' | 'expense';

export interface ExpenseRecord {
  id: string;
  amount: number;
  type: TransactionType;
  note: string;
  date: string; // YYYY-MM-DD
}
