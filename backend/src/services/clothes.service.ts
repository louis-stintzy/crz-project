import { clothesRepository } from '../repositories/clothes.repository';
import { ClothingItem } from '../types/closet.types';

const getAll = async (): Promise<ClothingItem[]> => {
  const items = await clothesRepository.findAll();
  return items;
};

export const clothesService = {
  getAll,
};
