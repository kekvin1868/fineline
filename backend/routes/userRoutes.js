import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Category from '../models/Category.js';

const router = Router();
router.use(protect)

// GET all user categories
router.get(`/:userId/categories`, async (req, res) => {
  console.log('userId: ', req.params.userId);

  try {
    const categories = await Category.findAll({
      where: {
        userId: req.params.userId,
        isArchived: false
      },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

export default router;
