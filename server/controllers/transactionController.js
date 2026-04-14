const Transaction = require('../models/Transaction');

// @desc    Get transactions (user: own, admin: all)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};

// @desc    Get transaction stats (user: own, admin: all)
// @route   GET /api/transactions/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const matchStage = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const transactions = await Transaction.find(matchStage);

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalUsers = req.user.role === 'admin'
      ? await require('../models/User').countDocuments()
      : 1;

    res.json({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { name, date, amount, type, category } = req.body;

    if (!name || !date || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const transaction = await Transaction.create({
      name,
      date,
      amount: parseFloat(amount),
      type,
      category,
      userId: req.user._id,
    });

    const populated = await Transaction.findById(transaction._id).populate('userId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error creating transaction' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private (user: own only, admin: any)
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // RBAC: user can only edit their own
    if (
      req.user.role !== 'admin' &&
      transaction.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to edit this transaction' });
    }

    const { name, date, amount, type, category } = req.body;
    transaction.name = name || transaction.name;
    transaction.date = date || transaction.date;
    transaction.amount = amount !== undefined ? parseFloat(amount) : transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;

    await transaction.save();
    const populated = await Transaction.findById(transaction._id).populate('userId', 'name email');
    res.json(populated);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error updating transaction' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private (user: own only, admin: any)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // RBAC: user can only delete their own
    if (
      req.user.role !== 'admin' &&
      transaction.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error deleting transaction' });
  }
};

module.exports = {
  getTransactions,
  getStats,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
