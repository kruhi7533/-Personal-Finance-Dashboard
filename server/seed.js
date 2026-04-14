/**
 * Seed Script — Creates an admin user and demo transactions
 * Run: node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@finflow.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: admin@finflow.com / admin123`);

    // Create Demo User
    const demoUser = await User.create({
      name: 'Sakshi Awasthi',
      email: 'sakshi@finflow.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`👤 User created: sakshi@finflow.com / user123`);

    // Demo Transactions for Admin
    const adminTransactions = [
      { name: 'Monthly Salary — TechCorp Pvt Ltd', date: '2026-03-31', amount: 85000, type: 'income', category: 'Salary', userId: admin._id },
      { name: 'Freelance UI Design Project', date: '2026-03-29', amount: 22000, type: 'income', category: 'Freelance', userId: admin._id },
      { name: 'Apartment Rent — March', date: '2026-03-28', amount: 18500, type: 'expense', category: 'Rent', userId: admin._id },
      { name: 'BigBasket Groceries', date: '2026-03-27', amount: 3240, type: 'expense', category: 'Groceries', userId: admin._id },
      { name: 'Swiggy Dinner', date: '2026-03-26', amount: 680, type: 'expense', category: 'Dining', userId: admin._id },
      { name: 'Zerodha Dividend Credit', date: '2026-03-25', amount: 4500, type: 'income', category: 'Investment', userId: admin._id },
      { name: 'Ola Cab — Office Commute', date: '2026-03-24', amount: 320, type: 'expense', category: 'Transport', userId: admin._id },
      { name: 'BESCOM Electricity Bill', date: '2026-03-23', amount: 1420, type: 'expense', category: 'Electricity', userId: admin._id },
      { name: 'Netflix Premium Subscription', date: '2026-03-22', amount: 649, type: 'expense', category: 'Subscriptions', userId: admin._id },
      { name: 'Apollo Pharmacy — Vitamins', date: '2026-03-21', amount: 860, type: 'expense', category: 'Pharmacy', userId: admin._id },
      { name: 'Monthly Salary — TechCorp Pvt Ltd', date: '2026-04-01', amount: 85000, type: 'income', category: 'Salary', userId: admin._id },
      { name: 'Q1 Performance Bonus', date: '2026-04-01', amount: 15000, type: 'income', category: 'Bonus', userId: admin._id },
      { name: 'Apartment Rent — April', date: '2026-04-02', amount: 18500, type: 'expense', category: 'Rent', userId: admin._id },
    ];

    // Demo Transactions for User
    const userTransactions = [
      { name: 'Freelance Content Writing', date: '2026-04-04', amount: 8500, type: 'income', category: 'Freelance', userId: demoUser._id },
      { name: 'DMart Weekly Groceries', date: '2026-04-02', amount: 2780, type: 'expense', category: 'Groceries', userId: demoUser._id },
      { name: 'HPCL Petrol Fill-up', date: '2026-04-03', amount: 2500, type: 'expense', category: 'Fuel', userId: demoUser._id },
      { name: 'Zomato Lunch', date: '2026-04-03', amount: 520, type: 'expense', category: 'Dining', userId: demoUser._id },
      { name: 'Spotify Premium', date: '2026-04-04', amount: 119, type: 'expense', category: 'Subscriptions', userId: demoUser._id },
      { name: 'OnePlus Nord 4 Purchase', date: '2026-04-05', amount: 27999, type: 'expense', category: 'Electronics', userId: demoUser._id },
      { name: 'NAMMA Metro Pass — Monthly', date: '2026-04-05', amount: 850, type: 'expense', category: 'Transport', userId: demoUser._id },
      { name: 'Mutual Fund SIP — Axis Bluechip', date: '2026-04-05', amount: 5000, type: 'expense', category: 'Investment', userId: demoUser._id },
      { name: 'Monthly Stipend', date: '2026-03-31', amount: 25000, type: 'income', category: 'Salary', userId: demoUser._id },
      { name: 'Udemy — React Advanced Course', date: '2026-03-20', amount: 499, type: 'expense', category: 'Education', userId: demoUser._id },
      { name: 'Starbucks Coffee', date: '2026-03-19', amount: 380, type: 'expense', category: 'Coffee', userId: demoUser._id },
      { name: 'PVR Cinema Tickets', date: '2026-03-18', amount: 900, type: 'expense', category: 'Entertainment', userId: demoUser._id },
      { name: 'Zara Clothing Purchase', date: '2026-03-17', amount: 4200, type: 'expense', category: 'Shopping', userId: demoUser._id },
      { name: 'BSNL Broadband Bill', date: '2026-03-16', amount: 999, type: 'expense', category: 'Internet', userId: demoUser._id },
      { name: 'Myntra Sale — Shoes', date: '2026-04-05', amount: 1899, type: 'expense', category: 'Shopping', userId: demoUser._id },
      { name: 'Parking Fine — MG Road', date: '2026-04-05', amount: 500, type: 'expense', category: 'Miscellaneous', userId: demoUser._id },
      { name: 'Dr. Mehta Consultation Fee', date: '2026-04-05', amount: 800, type: 'expense', category: 'Health', userId: demoUser._id },
    ];

    await Transaction.insertMany([...adminTransactions, ...userTransactions]);
    console.log(`📝 Created ${adminTransactions.length + userTransactions.length} demo transactions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('────────────────────────────────');
    console.log('Admin Login:  admin@finflow.com / admin123');
    console.log('User Login:   sakshi@finflow.com / user123');
    console.log('────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
