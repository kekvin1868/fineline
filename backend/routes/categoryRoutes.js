import { Router } from 'express';
import Category from '../models/Category.js';
import FlowType from '../models/Enum/FlowEnum.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCategoryCreation,
  validateCategoryUpdate
} from '../middleware/categoryValidationMiddleware.js';
import { Sequelize } from 'sequelize';
import { logger } from 'nuxt/kit';

const router = Router();
router.use(protect);

// CREATE category
router.post('/', validateCategoryCreation, async (req, res) => {
  const { name, flow } = req.body;

  try {
    // Check for duplicate name per user
    const existing = await Category.findOne({
      where: { userId: req.user.id, name }
    });

    console.log("Category exists or no?" + existing);

    if (existing) {
      return res.status(400).json({ error: 'Category with this name already exists.' });
    }

    const isFlowType = FlowType.values().includes(flow);

    if (!isFlowType) {
      return res.status(400).json({ error: 'Invalid flow type.' });
    }

    const category = await Category.create({
      name,
      flow,
      userId: req.user.id,
      isArchived: false,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err.stack);
    res.status(500).json({ error: `Internal server error: ${err.stack}` });
  }
});

// GET all active categories (excludes archived)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id, isArchived: false },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET all categories including archived
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['isArchived', 'DESC'], ['created_at', 'DESC']],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching all categories:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET all archived categories
router.get('/archived', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id, isArchived: true },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching archived categories:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET ALL CATEGORY STATS
router.get('/stats', async (req, res) => {
  try {
    const { sequelize } = Category;

    const categoryStats = await Category.findAll({
      where: {
        userId: req.user.id,
        isArchived: false
      },
      attributes: [
        'id',
        'name',
        'flow',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM "Transactions"
            WHERE "Transactions"."categoryId" = "Category"."id"
          )`),
          'transactionCount'
        ],
        [
          sequelize.literal(`(
            SELECT COALESCE(SUM(amount), 0)
            FROM "Transactions"
            WHERE "Transactions"."categoryId" = "Category"."id"
          )`),
          'totalAmount'
        ]
      ],
      order: [['created_at', 'DESC']],
      raw: true
    });

    const parsedStats = categoryStats.map(cat => ({
      ...cat,
      transactionCount: parseInt(cat.transactionCount) || 0,
      totalAmount: parseFloat(cat.totalAmount) || 0
    }));

    res.status(200).json(parsedStats);
  } catch (err) {
    logger.error('Error name:', err.name);
    logger.error('Error message:', err.message);
    logger.error('Stack:', err.stack);

    if (err.original) {
      logger.error('Original DB error:', err.original);
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single category (WITHOUT stats) - basic info only
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

// GET SINGLE CATEGORY STATS
router.get('/:id/stats', async (req, res) => {
  const { id } = req.params;

  try {
    const { sequelize } = Category;

    const categoryWithStats = await Category.findOne({
      where: {
        id,
        userId: req.user.id
      },
      attributes: [
        'id',
        'name',
        'flow',
        'isArchived',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM "Transactions"
            WHERE "Transactions"."categoryId" = "Category"."id"
          )`),
          'transactionCount'
        ],
        [
          sequelize.literal(`(
            SELECT COALESCE(SUM(amount), 0)
            FROM "Transactions"
            WHERE "Transactions"."categoryId" = "Category"."id"
          )`),
          'totalAmount'
        ]
      ],
      raw: true
    });

    if (!categoryWithStats) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const parsed = {
      ...categoryWithStats,
      transactionCount: parseInt(categoryWithStats.transactionCount) || 0,
      totalAmount: parseInt(categoryWithStats.totalAmount) || 0
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error('Error fetching category stats: ', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// UPDATE category => ARCHIVE and RESTORE categories
router.put('/:id', validateCategoryUpdate, async (req, res) => {
  const { id } = req.params;
  const { name, flow, isArchived } = req.body;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const updates = {};

    // Check for duplicate name
    if (name && name !== category.name) {
      const existing = await Category.findOne({
        where: { userId: req.user.id, name, id: { [Sequelize.Op.ne]: id } }
      });

      if (existing) {
        return res.status(400).json({ error: 'Category with this name already exists.' });
      }
      updates.name = name;
    }

    if (flow) {
      updates.flow = flow;
    }

    if (typeof isArchived !== undefined) {
      updates.isArchived = isArchived;
    }

    if (Object.keys(updates).length > 0) {
      await category.update(updates);
    }

    res.status(200).json(category);
  } catch (err) {
    console.error('Error updating category:', err.stack);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// DELETE permanently archived category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Archive the category
    await category.destroy();

    res.status(200).json({ message: 'Category permanently deleted.' });
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

export default router;
