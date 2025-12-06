// components/post-editor/location-search-input.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, X, Loader2, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useParams } from "next/navigation";
import { searchLocationsAction } from "@/app/actions/integrations";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSearchInputProps {
  initialLocation: { id: string | null; name: string };
  onLocationSelect: (location: { id: string; name: string } | null) => void;
  integrationId: string | null;
  isEnabled: boolean;
}

export default function LocationSearchInput({
  initialLocation,
  onLocationSelect,
  integrationId,
  isEnabled,
}: LocationSearchInputProps) {
  const params = useParams();
  const workspaceId = params.workspace as string;

  const [query, setQuery] = useState(initialLocation.name);
  const [debouncedQuery] = useDebounce(query, 300);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string | null;
    name: string;
  }>(initialLocation);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    setSelectedLocation(initialLocation);
    setQuery(initialLocation.name);
  }, [initialLocation]);

  // Update dropdown position when it should be shown
  useEffect(() => {
    if (isFocused && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isFocused, query]);

  const {
    data: searchResults = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["locations", debouncedQuery, integrationId, workspaceId],
    queryFn: async () => {
      if (!debouncedQuery || !integrationId || selectedLocation.id) {
        return [];
      }
      const result = await searchLocationsAction(
        debouncedQuery,
        integrationId,
        workspaceId
      );
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!debouncedQuery && !!integrationId && !selectedLocation.id,
  });

  const handleSelect = (location: { id: string; name: string }) => {
    setQuery(location.name);
    setSelectedLocation(location);
    onLocationSelect(location);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedLocation({ id: null, name: "" });
    onLocationSelect(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedLocation.id) {
      setSelectedLocation({ id: null, name: e.target.value });
      onLocationSelect(null);
    }
  };

  const showResults =
    isFocused && !selectedLocation.id && debouncedQuery.length >= 1;

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="relative animate-in fade-in-50">
      <label htmlFor="location" className="eyebrow mb-2 flex items-center">
        Location
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          id="location"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for a location..."
          className="h-9 pl-8 pr-8"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {showResults &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 9999,
            }}
            className="mt-1 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <ul className="max-h-60 overflow-y-auto p-1">
              {isLoading && (
                <li className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                </li>
              )}
              {isError && (
                <li className="p-4 text-center text-sm text-error">
                  Could not fetch locations.
                </li>
              )}
              {!isLoading && searchResults.length === 0 && (
                <li className="p-4 text-center text-sm text-muted-foreground">
                  Location not found
                </li>
              )}
              {searchResults.map((loc) => (
                <li
                  key={loc.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(loc)}
                  className="cursor-pointer rounded p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <p className="font-semibold text-sm text-foreground">
                    {loc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{loc.address}</p>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
