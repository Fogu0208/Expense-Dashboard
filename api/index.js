import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Expense from './models/Expense.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// MongoDB 连接
const MONGODB_URI = "mongodb+srv://fogu:202766@cluster0.g1l9bsz.mongodb.net/?appName=Cluster0";
const JWT_SECRET = "your-secret-key-change-this-in-production";

// 确保只连接一次
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 路由: 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ message: err.message });
  }
});

// 路由: 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 路由: 获取记录
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 路由: 添加记录
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      user: req.user.id
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 路由: 删除记录
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 导出 app 给 Vercel 使用
export default app;

// 本地开发启动
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
