import { z } from 'zod';
import {
  CLOTHING_CATEGORIES,
  CLOTHING_STYLES,
} from '../constants/clothes.constants';

export const clothingIdParamSchema = z.object({
  id: z.uuid('Invalid clothing item ID'),
});

export const clothingCategorySchema = z.enum(CLOTHING_CATEGORIES);
export const clothingStyleSchema = z.enum(CLOTHING_STYLES).optional();

export const clothingTypeSchema = z.object({
  category: clothingCategorySchema,
  subcategory: z.string().optional(),
});

export const createClothingItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: clothingTypeSchema,
  style: clothingStyleSchema,
  color: z.string().optional(),
  isFavorite: z.boolean().optional().default(false),
  comment: z.string().optional(),
});
