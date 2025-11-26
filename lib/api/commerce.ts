// lib/api/commerce.ts

import apiClient from "./index";

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

export const getCatalogs = async (integrationId: string): Promise<GetCatalogsResponse> => {
  try {
    const response = await apiClient.get<GetCatalogsResponse>(
      `/integrations/commerce/catalogs`,
      {
        params: { integrationId }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch catalogs:", error);
    // Return empty catalogs if endpoint not implemented yet
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      return { catalogs: [] };
    }
    throw error;
  }
};

export const getProducts = async (
  integrationId: string,
  catalogId: string,
  searchQuery?: string
): Promise<GetProductsResponse> => {
  try {
    const params: any = {
      integrationId,
      catalogId,
    };
    if (searchQuery) {
      params.search = searchQuery;
    }

    const response = await apiClient.get<GetProductsResponse>(
      `/integrations/commerce/products`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    // Return empty products if endpoint not implemented yet
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      return { products: [] };
    }
    throw error;
  }
};
