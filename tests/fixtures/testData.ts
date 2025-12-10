/**
 * Test data constants for the e-commerce application tests.
 * Maintains a single source of truth for expected values.
 */

export const PRODUCTS = [
  { name: 'Classic Leather Wallet', price: 49.99 },
  { name: 'Wireless Bluetooth Headphones', price: 129.99 },
  { name: 'Stainless Steel Water Bottle', price: 34.99 },
  { name: 'Minimalist Desk Lamp', price: 79.99 },
  { name: 'Cotton Canvas Backpack', price: 89.99 },
  { name: 'Ceramic Coffee Mug Set', price: 44.99 },
  { name: 'Bamboo Cutting Board', price: 29.99 },
  { name: 'Mechanical Keyboard', price: 149.99 },
] as const;

export const EXPECTED_PRODUCT_COUNT = 8;

export const STORE_NAME = 'Visual Testing Store';

export const PAGE_TITLES = {
  home: 'Our Products',
  cart: 'Shopping Cart',
} as const;

