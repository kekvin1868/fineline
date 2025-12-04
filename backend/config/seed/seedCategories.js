import Category from '../../models/Category.js';
import FlowEnum from '../../models/Enum/FlowEnum.js';

const DEFAULT_CATEGORIES = [
  // EXPENSE
  { name: 'Transport', flow: FlowEnum.EXPENSE },
  { name: 'Health', flow: FlowEnum.EXPENSE },
  { name: 'Food', flow: FlowEnum.EXPENSE },
  { name: 'Leisure', flow: FlowEnum.EXPENSE },
  { name: 'Gifts', flow: FlowEnum.EXPENSE },

  // INCOME
  { name: 'Investments', flow: FlowEnum.INCOME },
  { name: 'Salary', flow: FlowEnum.INCOME },
  { name: 'Bonus', flow: FlowEnum.INCOME },
  { name: 'Freelance', flow: FlowEnum.INCOME },
  { name: 'Transfers', flow: FlowEnum.INCOME },

  // UNCATEGORIZE
  { name: 'Uncategorized', flow: FlowEnum.UNCATEGORIZED },
];

/**
 * Seeds default categories for a user
 * Call this after creating/finding a user
 */
export const seedDefaultCategory = async (userId) => {
  try {
    const createdCategories = [];

    for (const categoryData of DEFAULT_CATEGORIES) {
      // Check if category already exists
      const existing = await Category.findOne({
        where: { userId, name: categoryData.name }
      });

      if (existing) {
        console.log(`Category "${categoryData.name}" already exists for user ${userId}`);
        createdCategories.push(existing);
        continue;
      }

      try {
        // Create default category
        const createdCategory = await Category.create({
          name: categoryData.name,
          flow: categoryData.flow,
          userId,
          isArchived: false,
        });

        console.log(`Created default category "${categoryData.name}" for user ${userId}`);
        createdCategories.push(createdCategory);
      } catch (itemErr) {
        console.error(`Failed to create category "${categoryData.name}" for user ${userId}:`, itemErr);
        continue;
      }
    }

    return createdCategories;
  } catch (err) {
    console.error('Error seeding default categories:', err);
    throw err;
  }
};
