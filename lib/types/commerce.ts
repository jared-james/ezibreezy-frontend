// lib/types/commerce.ts

export interface Catalog {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  url?: string;
}

export interface GetCatalogsResponse {
  catalogs: Catalog[];
}

export interface GetProductsResponse {
  products: Product[];
}
