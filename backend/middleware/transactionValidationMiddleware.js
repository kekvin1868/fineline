export function validateTransaction(req, res, next) {
  const { amount, categoryId, date } = req.body;

  // Validate amount
  const validationError = validateAmount(amount);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // Validate date
  if (date && !isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format.' });
  }

  next();
}

export function validatePagination(req, res, next) {
  const { page, limit } = req.query;

  // Validate Page
  if (page && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return res.status(400).json({ error: 'Page must be a positive integer.' });
  }

  // Validate Limit
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return res.status(400).json({ error: 'Limit must be a positive integer.' });
  }

  next();
}

const validateAmount = (amount) => {
  if (amount === undefined || amount === null) {
    return { error: 'Amount is required.' };
  }

  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (typeof numAmount !== 'number' || !Number.isFinite(numAmount)) {
    return { error: 'Amount must be a valid number.' };
  }
  if (numAmount === 0) {
    return { error: 'Amount cannot be zero.' };
  }
  if (!Number.isInteger(numAmount * 100)) {
    return { error: 'Amount must have at most 2 decimal places.' };
  }
  return null;
};

const isValidDate = (dateString) => {
  if (!dateString) return true; // Allow empty dates
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
