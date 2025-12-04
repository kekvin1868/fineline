import Category from '../models/Category.js';
import FlowEnum from '../models/Enum/FlowEnum.js';

export const getUncategorized = async (userId) => {
  try {
    let uncategorized = await Category.findOne({
      where: {
        userId,
        name: 'Uncategorized',
        flow: FlowEnum.UNCATEGORIZED
      }
    });

    if (!uncategorized) {
      uncategorized = await Category.create({
        name: 'Uncategorized',
        flow: FlowEnum.UNCATEGORIZED,
        userId,
        isArchive: false,
      });
    }

    return uncategorized;
  } catch (err) {
    throw err;
  }
}
