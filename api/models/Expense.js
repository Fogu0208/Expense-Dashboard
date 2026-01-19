import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  note: { type: String },
  date: { type: String, required: true }
}, { timestamps: true });

// 将 _id 映射为 id
ExpenseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model('Expense', ExpenseSchema);
