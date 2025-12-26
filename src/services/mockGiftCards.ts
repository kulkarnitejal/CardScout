import { GiftCard } from '../types';

export const mockGiftCards: GiftCard[] = [
  {
    id: 'gc_fdc_samsclub',
    merchant: 'Fogo de Chão',
    discountPercent: 20,
    availableAmount: 100,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_sw_samsclub1',
    merchant: 'Southwest Airlines',
    discountPercent: 5,
    availableAmount: 500,
    source: 'Sams Club',
    category: 'Travel',
  },
  {
    id: 'gc_sw_samsclub2',
    merchant: 'Southwest Airlines',
    discountPercent: 5,
    availableAmount: 250,
    source: 'Sams Club',
    category: 'Travel',
  },
  {
    id: 'gc_saltgrass_samsclub',
    merchant: 'Saltgrass Steakhouse',
    discountPercent: 20,
    availableAmount: 100,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_bubbagump_samsclub',
    merchant: 'Bubba Gump Shrimp Co.',
    discountPercent: 20,
    availableAmount: 100,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_xbox_samsclub',
    merchant: 'Xbox',
    discountPercent: 10,
    availableAmount: 100,
    source: 'Sams Club',
    category: 'Entertainment',
  },
  {
    id: 'gc_wendys_samsclub',
    merchant: 'Wendys',
    discountPercent: 20,
    availableAmount: 60,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_coldstone_samsclub',
    merchant: 'Coldstone Creamery',
    discountPercent: 33,
    availableAmount: 30,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_topgolf_samsclub',
    merchant: 'Top Golf',
    discountPercent: 20,
    availableAmount: 75,
    source: 'Sams Club',
    category: 'Entertainment',
  },
  {
    id: 'gc_cinemark_samsclub',
    merchant: 'Cinemark',
    discountPercent: 20,
    availableAmount: 50,
    source: 'Sams Club',
    category: 'Entertainment',
  },
  {
    id: 'gc_petsmart_samsclub',
    merchant: 'PetSmart',
    discountPercent: 10,
    availableAmount: 100,
    source: 'Sams Club',
    category: 'Grocery',
  },{
    id: 'gc_redlobster_samsclub',
    merchant: 'Red Lobster',
    discountPercent: 20,
    availableAmount: 100,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_potbelly_samsclub',
    merchant: 'Potbelly',
    discountPercent: 25,
    availableAmount: 50,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_pfchangs_samsclub',
    merchant: 'P.F. Chang\'s',
    discountPercent: 20,
    availableAmount: 50,
    source: 'Sams Club',
    category: 'Restaurant',
  },
  {
    id: 'gc_quince_samsclub',
    merchant: 'Quince',
    discountPercent: 20,
    availableAmount: 50,
    source: 'Sams Club',
    category: 'Retail',
  },
  {
    id: 'gc_amc_samsclub',
    merchant: 'AMC Theatres',
    discountPercent: 40,
    availableAmount: 50,
    source: 'Sams Club',
    category: 'Entertainment',
  },
];

export const getGiftCardByMerchant = (merchantName: string): GiftCard | undefined => {
  return mockGiftCards.find(
    (gc) => gc.merchant.toLowerCase() === merchantName.toLowerCase()
  );
};

export const getAllGiftCards = (): GiftCard[] => {
  return mockGiftCards;
};
