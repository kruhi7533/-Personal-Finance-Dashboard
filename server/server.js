const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/force-seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Transaction = require('./models/Transaction');

    await User.deleteMany({});
    await Transaction.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@finflow.com',
      password: 'admin123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'User',
      email: 'sakshi@finflow.com',
      password: 'user123',
      role: 'user',
    });

    const adminTransactions = [
      { name: 'Monthly Salary — TechCorp Pvt Ltd', date: '2026-03-31', amount: 85000, type: 'income', category: 'Salary', userId: admin._id },
      { name: 'Freelance UI Design Project', date: '2026-03-29', amount: 22000, type: 'income', category: 'Freelance', userId: admin._id },
    ];
    await Transaction.insertMany(adminTransactions);

    res.json({ message: 'Database reset and seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FinFlow API running on port ${PORT}`);
});
