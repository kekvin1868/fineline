import { Router } from 'express';
import Transaction from '../models/Transaction.js';

const router = Router();

const CURRENT_USER_ID = '9046c827-023a-43c1-b0e2-628676d54d9c';

// --- CREATE TRANSACTIONS --- //
router.post('/', async (req, res) => {
  const { description, amount } = req.body;

  const validationError = validateAmount(amount);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    const newTransaction = await Transaction.create({
      description,
      amount,
      userId: CURRENT_USER_ID,
    });

    res.status(201).json(newTransaction);
  } catch(err) {
    console.error("Error adding transaction: ", err.stack);
    res.status(500).json({ error: 'Internal server error.'});
  }
});

// --- LIST TRANSACTIONS --- //
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: CURRENT_USER_ID },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- UPDATE TRANSACTIONS --- //
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;

  const validationError = validateAmount(amount);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    const transaction = await Transaction.findOne({
      where: { id, userId: CURRENT_USER_ID },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Update
    await transaction.update({ description, amount });
    res.status(200).json(transaction);
  } catch (err) {
    console.error('Error updating transaction:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- DELETE TRANSACTIONS --- //
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      where: { id, userId: CURRENT_USER_ID },
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

const validateAmount = (amount) => {
  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'Amount is required.'});
  }
  // Validate amount type and value
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return res.status(400).json({ error: 'Amount must be a valid number.' });
  }
  // Reasonable bounds (e.g., not negative, not extremely large, max 2 decimal places)
  if (amount < 0) {
    return res.status(400).json({ error: 'Amount cannot be negative.' });
  }
  if (amount > 1000000) {
    return res.status(400).json({ error: 'Amount is too large.' });
  }
  // Check for max 2 decimal places
  if (!Number.isInteger(amount * 100)) {
    return res.status(400).json({ error: 'Amount must have at most 2 decimal places.' });
  }

  return null;
}

export default router;