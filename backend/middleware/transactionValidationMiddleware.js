export function validateTransaction(req, res, next) {
  const { amount, category } = req.body;

  // Validate amount
  const validationError = validateAmount(amount);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // Validate category
  if (category && typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid category.' });
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
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return { error: 'Amount must be a valid number.' };
  }
  if (amount < 0) {
    return { error: 'Amount cannot be negative.' };
  }
  if (amount > 1000000) {
    return { error: 'Amount is too large.' };
  }
  if (!Number.isInteger(amount * 100)) {
    return { error: 'Amount must have at most 2 decimal places.' };
  }
  return null;
};
