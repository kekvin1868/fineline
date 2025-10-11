import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateTransaction, validatePagination } from '../middleware/transactionValidationMiddleware.js';
import { validateCategoryOwnership } from '../middleware/categoryValidationMiddleware.js';

const router = Router();
router.use(protect);

// CREATE Transaction
router.post('/', validateTransaction, validateCategoryOwnership, async (req, res) => {
  const { description, amount, categoryId, date } = req.body;

  try {
    const newTransaction = await Transaction.create({
      description,
      amount,
      categoryId,
      date,
      userId: req.user.id,
    });

    res.status(201).json(newTransaction);
  } catch(err) {
    console.error("Error adding transaction: ", err.stack);
    res.status(500).json({ error: 'Internal server error.'});
  }
});

// GET Transaction
router.get('/', validatePagination, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default

  try {
    const transactions = await Transaction.findAndCountAll({
      where: { userId: req.user.id },
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
router.put('/:id', validateTransaction, async (req, res) => {
  const { id } = req.params;
  const { description, amount, category, date } = req.body;

  try {
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Update
    await transaction.update({ description, amount, category, date });
    res.status(200).json(transaction);
  } catch (err) {
    console.error('Error updating transaction:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
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

export default router;