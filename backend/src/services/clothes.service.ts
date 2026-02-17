import { ClothingItem } from '../types/closet.types';

const clothes: ClothingItem[] = [
  {
    id: 1,
    name: 'Red T-Shirt',
    type: { category: 'top', subcategory: 't-shirt' },
    style: 'casual',
    color: 'red',
    isFavorite: true,
    comment: 'My favorite red t-shirt!',
  },
  {
    id: 2,
    name: 'Blue Jeans',
    type: { category: 'bottom', subcategory: 'jeans' },
    style: 'casual',
    color: 'blue',
    isFavorite: false,
  },
  {
    id: 3,
    name: 'White Sneakers',
    type: { category: 'shoes', subcategory: 'sneakers' },
    style: 'sportswear',
    color: 'white',
    isFavorite: true,
  },
];

const getAll = async (): Promise<ClothingItem[]> => {
  console.log('Fetching all clothes from the database');
  // Simulate fetching data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clothes);
    }, 3000);
  });
};

export const clothesService = {
  getAll,
};
