export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
