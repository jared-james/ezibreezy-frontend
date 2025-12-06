// app/actions/commerce.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type {
  GetCatalogsResponse,
  GetProductsResponse,
} from "@/lib/types/commerce";

export async function getCatalogsAction(
  integrationId: string,
  workspaceId: string
): Promise<{ success: boolean; data?: GetCatalogsResponse; error?: string }> {
  try {
    const params = new URLSearchParams({ integrationId });
    const result = await serverFetch<GetCatalogsResponse>(
      `/integrations/commerce/catalogs?${params.toString()}`,
      { workspaceId }
    );
    return result;
  } catch (error) {
    // Return empty catalogs if endpoint not implemented yet
    const err = error as { response?: { status?: number }; message?: string };
    if (err?.response?.status === 400 || err?.response?.status === 404) {
      return { success: true, data: { catalogs: [] } };
    }
    return { success: false, error: err.message || "Failed to fetch catalogs" };
  }
}

export async function getProductsAction(
  integrationId: string,
  catalogId: string,
  workspaceId: string,
  searchQuery?: string
): Promise<{ success: boolean; data?: GetProductsResponse; error?: string }> {
  try {
    const params: Record<string, string> = {
      integrationId,
      catalogId,
    };
    if (searchQuery) {
      params.search = searchQuery;
    }

    const queryString = new URLSearchParams(params).toString();
    const result = await serverFetch<GetProductsResponse>(
      `/integrations/commerce/products?${queryString}`,
      { workspaceId }
    );
    return result;
  } catch (error) {
    // Return empty products if endpoint not implemented yet
    const err = error as { response?: { status?: number }; message?: string };
    if (err?.response?.status === 400 || err?.response?.status === 404) {
      return { success: true, data: { products: [] } };
    }
    return { success: false, error: err.message || "Failed to fetch products" };
  }
}
