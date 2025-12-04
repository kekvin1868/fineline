import Category from '../models/Category.js';
import { getUncategorized } from '../config/helper.js';

export function validateCategoryCreation(req, res, next) {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Category name is required and must be a non-empty string.' });
  }

  if (name.length > 50) {
    return res.status(400).json({ error: 'Category name must not exceed 50 characters.' });
  }

  next();
}

export function validateCategoryUpdate(req, res, next) {
  const { name } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Category name must be a non-empty string.' });
    }

    if (name.length > 50) {
      return res.status(400).json({ error: 'Category name must not exceed 50 characters.' });
    }
  }

  next();
}

/**
  * Ensures category exists and belongs to the user
  */
export async function validateCategoryOwnership(req, res, next) {
  let { categoryId } = req.body;
  const userId = req.user.id;

  try {
    const isEmpty = !categoryId || categoryId === null || categoryId === undefined || categoryId === '';
    const category = isEmpty
      ? await getUncategorized(userId)
      : await Category.findOne
        ({
          where: { id: categoryId, userId, isArchived: false }
        });

    if (!category) {
      return res.status(404).json({ error: 'Category not found or has been archived or does not belong to the user.' });
    }

    req.body.categoryId = category.id;
    next();
  } catch (err) {
    console.error('Error validating category ownership:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
