import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateTransaction, validatePagination } from '../middleware/transactionValidationMiddleware.js';
import { validateCategoryOwnership } from '../middleware/categoryValidationMiddleware.js';

const router = Router();
router.use(protect);

// CREATE Transaction
router.post('/', validateTransaction, validateCategoryOwnership, async (req, res) => {
  try {
    const { description, amount, categoryId, date } = req.body;
    const userId = req.user.id;

    if (amount === undefined || amount === 0 || !date) {
      return res.status(400).json({
        error: 'Invalid transaction data.'
      });
    }

    const transaction = await Transaction.create({
      description,
      amount,
      categoryId,
      date,
      userId
    });

    res.status(201).json(transaction);

  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction: ', err });
  }
});

// GET Transaction
router.get('/', validatePagination, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default

  try {
    const transactions = await Transaction.findAndCountAll({
      where: { userId: req.user.id },
      include: Category,
      order: [['created_at', 'DESC']],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.status(200).json({
      total: transactions.count,
      page: parseInt(page),
      limit: parseInt(limit),
      transactions: transactions.rows,
    });
  } catch (err) {
    console.error('Error fetching transactions:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// UPDATE Transaction
router.put('/:id', validateTransaction, validateCategoryOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, categoryId, date } = req.body;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Update
    await transaction.update({
      description: description !== undefined
        ? description
        : transaction.description,
      amount: amount !== undefined
        ? amount
        : transaction.amount,
      categoryId: categoryId !== undefined
        ? categoryId
        : transaction.categoryId,
      date: date !== undefined
        ? date
        : transaction.date,
    });

    const updated = await Transaction.findByPk(transaction.id, {
      include: Category
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating transaction:', err.stack);
    res.status(500).json({ error: 'Failed to update transaction.' });
  }
});

// DELETE Transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Delete
    await transaction.destroy();
    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (err) {
    console.error('Error deleting transaction:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// MIGRATE TRANSACTIONS FROM DEMO TO DATABASE
router.post('/migrate/from-demo', async (req, res) => {
  const { transactions } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Transactions must be an array' });
  }

  try {
    const migratedTransactions = [];

    for (const txn of transactions) {
      try {
        // Verify category belongs to user and is not archived
        const category = await Category.findOne({
          where: {
            id: txn.categoryId,
            userId,
            isArchived: false
          }
        });

        if (!category) {
          console.warn(`Category ${txn.categoryId} not found or is archived, skipping transaction`);
          continue;
        }

        // Check if transaction already exists (by date, amount, description combo)
        const existing = await Transaction.findOne({
          where: {
            userId,
            categoryId: txn.categoryId,
            amount: txn.amount,
            date: txn.date,
            description: txn.description
          }
        });

        if (existing) {
          console.log(`Transaction already exists, skipping: ${txn.description}`);
          migratedTransactions.push(existing);
          continue;
        }

        // Create new transaction
        const newTxn = await Transaction.create({
          description: txn.description,
          amount: txn.amount,
          date: txn.date || new Date(),
          categoryId: txn.categoryId,
          userId
        });

        migratedTransactions.push(newTxn);
      } catch (err) {
        console.error(`Error migrating transaction: ${err.message}`);
        continue; // Skip failed transactions and continue
      }
    }

    res.status(201).json({
      message: `Migrated ${migratedTransactions.length} transactions`,
      count: migratedTransactions.length,
      transactions: migratedTransactions
    });
  } catch (err) {
    console.error('Error during migration:', err.stack);
    res.status(500).json({ error: 'Migration failed', details: err.message });
  }
});

export default router;
