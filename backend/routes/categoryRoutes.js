import { Router } from 'express';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCategoryCreation,
  validateCategoryUpdate,
  preventDefaultCategoryDeletion
} from '../middleware/categoryValidationMiddleware.js';

const router = Router();
router.use(protect);

// CREATE category
router.post('/', validateCategoryCreation, async (req, res) => {
  const { name } = req.body;

  try {
    // Check for duplicate name per user
    const existing = await Category.findOne({
      where: { userId: req.user.id, name }
    });

    if (existing) {
      return res.status(400).json({ error: 'Category with this name already exists.' });
    }

    const category = await Category.create({
      name,
      userId: req.user.id,
      isDefault: false,
      isArchived: false,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET all active categories (excludes archived)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id, isArchived: false },
      order: [['isDefault', 'DESC'], ['created_at', 'ASC']],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET all categories including archived (for admin/management view)
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['isArchived', 'ASC'], ['isDefault', 'DESC'], ['created_at', 'ASC']],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching all categories:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET single category
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error('Error fetching category:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// UPDATE category
router.put('/:id', validateCategoryUpdate, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    if (category.isDefault) {
      return res.status(403).json({ error: 'Cannot modify the default category.' });
    }

    // Check for duplicate name
    if (name) {
      const existing = await Category.findOne({
        where: { userId: req.user.id, name, id: { [sequelize.Op.ne]: id } }
      });

      if (existing) {
        return res.status(400).json({ error: 'Category with this name already exists.' });
      }

      await category.update({ name });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error('Error updating category:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ARCHIVE category (soft delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    if (category.isDefault) {
      return res.status(403).json({ error: 'Cannot delete the default category.' });
    }

    // Archive the category
    await category.update({ isArchived: true });

    res.status(200).json({ message: 'Category archived successfully.' });
  } catch (err) {
    console.error('Error archiving category:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// RESTORE archived category
router.post('/:id/restore', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id, isArchived: true }
    });

    if (!category) {
      return res.status(404).json({ error: 'Archived category not found.' });
    }

    await category.update({ isArchived: false });

    res.status(200).json(category);
  } catch (err) {
    console.error('Error restoring category:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;