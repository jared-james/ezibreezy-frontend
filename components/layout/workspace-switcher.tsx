// components/layout/workspace-switcher.tsx

"use client";

import * as React from "react";
import { ChevronsUpDown, Check, Building2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

import type { OrganizationNode } from "@/lib/store/workspace-store";

interface WorkspaceSwitcherProps {
  initialStructure?: OrganizationNode[];
}

export function WorkspaceSwitcher({ initialStructure }: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const hasInitialized = React.useRef(false);

  const {
    structure,
    currentWorkspace,
    currentOrganization,
    setCurrentWorkspace,
    setStructure,
  } = useWorkspaceStore();

  // Initialize store SYNCHRONOUSLY during render if we have initial data
  // This ensures the store is populated before the first render completes
  if (initialStructure && initialStructure.length > 0 && structure.length === 0 && !hasInitialized.current) {
    console.log("🟡 [WorkspaceSwitcher] SYNC initialization with server data");
    setStructure(initialStructure);
    hasInitialized.current = true;
  }

  // Use initialStructure or store structure, whichever is available
  // During SSR/hydration, the store might not be updated yet, so fallback to initialStructure
  const effectiveStructure = structure.length > 0 ? structure : (initialStructure || []);

  // Derive workspace and org from effectiveStructure if store hasn't updated yet
  let effectiveWorkspace = currentWorkspace;
  let effectiveOrg = currentOrganization;

  // If store is empty but we have initialStructure, derive the values
  if (!effectiveWorkspace && effectiveStructure.length > 0) {
    // Find the first workspace in the structure
    for (const node of effectiveStructure) {
      if (node.workspaces.length > 0) {
        const firstWs = node.workspaces[0];
        effectiveWorkspace = {
          ...firstWs,
          organizationId: node.organization.id,
        };
        effectiveOrg = node.organization;
        break;
      }
    }
  }

  // Debug: Log what we receive
  console.log("🟡 [WorkspaceSwitcher] Render:", {
    receivedInitialStructure: !!initialStructure,
    initialLength: initialStructure?.length,
    storeLength: structure.length,
    effectiveLength: effectiveStructure.length,
    hasCurrentWorkspace: !!effectiveWorkspace
  });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (workspaceId: string) => {
    setCurrentWorkspace(workspaceId);
    setOpen(false);
    // Optional: Refresh page if deep context changes require it,
    // but the store update should trigger re-renders in other components.
    // router.refresh();
  };

  // Debug logging
  console.log("🔴 [WorkspaceSwitcher] Render state:", {
    hasCurrentWorkspace: !!currentWorkspace,
    hasCurrentOrg: !!currentOrganization,
    structureLength: structure.length,
    currentWorkspace,
    currentOrganization,
    structure,
  });

  // If data hasn't loaded yet
  if (!effectiveWorkspace || !effectiveOrg) {
    // If structure is empty, user has no workspaces
    if (effectiveStructure.length === 0) {
      console.warn("⚠️ [WorkspaceSwitcher] No workspaces available");
      return (
        <div className="h-16 flex items-center justify-center px-6 border-b-2 border-[--foreground]">
          <span className="font-serif text-sm text-[--error]">
            No workspaces available
          </span>
        </div>
      );
    }

    // Still loading (shouldn't happen with server-side fetch, but handle gracefully)
    console.warn("⚠️ [WorkspaceSwitcher] Still loading - missing:", {
      missingWorkspace: !effectiveWorkspace,
      missingOrg: !effectiveOrg,
      effectiveStructureLength: effectiveStructure.length,
    });

    return (
      <div className="h-16 flex items-center justify-center px-6 border-b-2 border-[--foreground]">
        <span className="font-serif text-sm text-[--muted]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div
      className="px-4 py-3 border-b border-border relative select-none"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2"
      >
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-col items-start overflow-hidden min-w-0">
            <span
              className="font-serif text-sm font-bold text-foreground truncate w-full text-left"
              title={effectiveWorkspace.name}
            >
              {effectiveWorkspace.name}
            </span>
            <span
              className="font-serif text-xs text-muted-foreground truncate w-full text-left"
              title={effectiveOrg.name}
            >
              {effectiveOrg.name}
            </span>
          </div>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-4 right-4 bg-background border border-border shadow-xl max-h-[400px] overflow-y-auto z-50">
          <div className="py-2">
            {effectiveStructure.map((node) => (
              <div key={node.organization.id} className="mb-4 last:mb-0">
                {/* Organization Header */}
                <div className="px-3 py-1.5 mb-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-serif text-xs uppercase tracking-wider text-muted-foreground">
                      {node.organization.name}
                    </span>
                  </div>
                </div>

                {/* Workspaces List */}
                <div>
                  {node.workspaces.map((workspace) => {
                    const isActive = effectiveWorkspace.id === workspace.id;
                    return (
                      <button
                        key={workspace.id}
                        onClick={() => handleSelect(workspace.id)}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 font-serif text-sm transition-colors hover:bg-surface-hover",
                          isActive && "font-bold text-foreground bg-surface",
                          !isActive && "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Briefcase className="h-4 w-4 shrink-0" />
                          <span className="truncate">{workspace.name}</span>
                        </div>
                        {isActive && (
                          <Check className="h-4 w-4 ml-2 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
