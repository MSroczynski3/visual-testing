-- Seed data for Visual Testing demo
-- Using placeholder images from picsum.photos with fixed seed for determinism

INSERT INTO products (id, name, description, price, image_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Classic Leather Wallet', 'Handcrafted genuine leather wallet with multiple card slots and a coin pocket. Timeless design that ages beautifully.', 49.99, 'https://picsum.photos/seed/wallet/400/300'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Wireless Bluetooth Headphones', 'Premium over-ear headphones with active noise cancellation. 30-hour battery life and crystal-clear audio.', 129.99, 'https://picsum.photos/seed/headphones/400/300'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Stainless Steel Water Bottle', 'Double-walled vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. 750ml capacity.', 34.99, 'https://picsum.photos/seed/bottle/400/300'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Minimalist Desk Lamp', 'Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.', 79.99, 'https://picsum.photos/seed/lamp/400/300'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Cotton Canvas Backpack', 'Durable canvas backpack with padded laptop compartment. Perfect for daily commute or weekend adventures.', 89.99, 'https://picsum.photos/seed/backpack/400/300'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Ceramic Coffee Mug Set', 'Set of 4 handmade ceramic mugs in earthy tones. Microwave and dishwasher safe. 350ml each.', 44.99, 'https://picsum.photos/seed/mugs/400/300'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Bamboo Cutting Board', 'Eco-friendly bamboo cutting board with juice groove. Naturally antimicrobial and knife-friendly.', 29.99, 'https://picsum.photos/seed/board/400/300'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Mechanical Keyboard', 'Compact 75% mechanical keyboard with hot-swappable switches. RGB backlighting and premium PBT keycaps.', 149.99, 'https://picsum.photos/seed/keyboard/400/300')
ON CONFLICT (id) DO NOTHING;
