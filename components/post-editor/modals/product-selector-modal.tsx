// components/post-editor/modals/product-selector-modal.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Loader2, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  getCatalogs,
  getProducts,
  type Catalog,
  type Product,
} from "@/lib/api/commerce";
import { toast } from "sonner";

interface ProductSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  integrationId: string | null; // <--- ADDED PROP
}

export function ProductSelectorModal({
  open,
  onClose,
  onSelectProduct,
  integrationId, // <--- ADDED PROP
}: ProductSelectorModalProps) {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch catalogs on mount
  useEffect(() => {
    if (open && integrationId) {
      fetchCatalogs();
    }
  }, [open, integrationId]);

  // Fetch products when catalog or search query changes
  useEffect(() => {
    if (selectedCatalog && integrationId) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCatalog, searchQuery, integrationId]);

  const fetchCatalogs = async () => {
    if (!integrationId) return; // <--- Guard clause

    setIsLoadingCatalogs(true);
    try {
      // <--- FIXED: Passing integrationId
      const response = await getCatalogs(integrationId);
      setCatalogs(response.catalogs);

      // Auto-select first catalog if available
      if (response.catalogs.length > 0) {
        setSelectedCatalog(response.catalogs[0]);
      }
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
      toast.error("Failed to load product catalogs");
    } finally {
      setIsLoadingCatalogs(false);
    }
  };

  const fetchProducts = async () => {
    if (!selectedCatalog || !integrationId) return;

    setIsLoadingProducts(true);
    try {
      const response = await getProducts(
        integrationId, // <--- Passing integrationId
        selectedCatalog.id,
        searchQuery || undefined
      );
      setProducts(response.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  const handleClose = useCallback(() => {
    setSearchQuery("");
    setProducts([]);
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Tag Products
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingCatalogs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : catalogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">No catalogs found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Connect your product catalog to start tagging products
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Catalog Selector */}
                {catalogs.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catalog
                    </label>
                    <select
                      value={selectedCatalog?.id || ""}
                      onChange={(e) => {
                        const catalog = catalogs.find(
                          (c) => c.id === e.target.value
                        );
                        setSelectedCatalog(catalog || null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {catalogs.map((catalog) => (
                        <option key={catalog.id} value={catalog.id}>
                          {catalog.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Products List */}
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No products found matching your search"
                        : "No products available"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
                      >
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-sm text-gray-500 truncate">
                              {product.description}
                            </p>
                          )}
                          {product.price && (
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              {product.price}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
