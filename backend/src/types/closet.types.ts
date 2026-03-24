import { z } from 'zod';
import { createClothingItemSchema } from '../schemas/clothes.schema';

// export interface ClothingType {
//   category: (typeof CLOTHING_CATEGORIES)[number];
//   subcategory: string;
// }

// export interface ClothingItem {
//   id: string;
//   name: string;
//   type: ClothingType;
//   style: (typeof CLOTHING_STYLES)[number];
//   color: string;
//   isFavorite: boolean;
//   comment?: string;
// }

// export type CreateClothingItemDTO = Omit<ClothingItem, 'id'>;

export type ClothingId = {
  id: string;
};

export type CreateClothingItemDTO = z.infer<typeof createClothingItemSchema>;
export type ClothingItem = CreateClothingItemDTO & ClothingId;

export interface Closet {
  isOpen: boolean;
  clothes: ClothingItem[];
}
