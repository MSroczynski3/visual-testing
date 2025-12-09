import { Router, Request, Response } from 'express';
import { supabase } from '../supabase.js';
import type { Product, ApiResponse } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response<ApiResponse<Product[]>>) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ data: null, error: 'Failed to fetch products' });
    return;
  }

  res.json({ data, error: null });
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response<ApiResponse<Product>>) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ data: null, error: 'Failed to fetch product' });
    return;
  }

  if (!data) {
    res.status(404).json({ data: null, error: 'Product not found' });
    return;
  }

  res.json({ data, error: null });
});

export default router;
