/**
 * Test data constants for the e-commerce application tests.
 * Maintains a single source of truth for expected values.
 */

export const PRODUCTS = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Classic Leather Wallet', price: 49.99 },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Wireless Bluetooth Headphones', price: 129.99 },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Stainless Steel Water Bottle', price: 34.99 },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Minimalist Desk Lamp', price: 79.99 },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Cotton Canvas Backpack', price: 89.99 },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Ceramic Coffee Mug Set', price: 44.99 },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Bamboo Cutting Board', price: 29.99 },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Mechanical Keyboard', price: 149.99 },
] as const;

export const EXPECTED_PRODUCT_COUNT = 8;

export const STORE_NAME = 'Visual Testing Store';

export const PAGE_TITLES = {
  home: 'Our Products',
  cart: 'Shopping Cart',
} as const;

