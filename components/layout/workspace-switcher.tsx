// components/layout/workspace-switcher.tsx

"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Check,
  Building2,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function WorkspaceSwitcher() {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const {
    structure,
    currentWorkspace,
    currentOrganization,
    setCurrentWorkspace,
  } = useWorkspaceStore();

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
  if (!currentWorkspace || !currentOrganization) {
    // If structure is empty, user has no workspaces
    if (structure.length === 0) {
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
      missingWorkspace: !currentWorkspace,
      missingOrg: !currentOrganization,
      structureLength: structure.length,
    });

    return (
      <div className="h-16 flex items-center justify-center px-6 border-b-2 border-[--foreground]">
        <span className="font-serif text-sm text-[--muted]">
          Loading... (check console)
        </span>
      </div>
    );
  }

  return (
    <div
      className="h-16 flex items-center px-6 border-b-2 border-foreground relative select-none"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full group outline-none"
      >
        <div className="flex flex-col items-start overflow-hidden">
          <span
            className="font-serif text-[0.65rem] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-left"
            title={currentOrganization.name}
          >
            {currentOrganization.name}
          </span>
          <span
            className="font-serif font-bold text-sm uppercase tracking-wider text-foreground truncate w-full text-left"
            title={currentWorkspace.name}
          >
            {currentWorkspace.name}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-foreground" />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div
          className="absolute top-[102%] -left-0.5 -right-0.5 bg-background border-2 border-foreground shadow-xl max-h-[400px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          style={{ zIndex: 9999 }}
        >
          <div className="p-2 space-y-4">
            {structure.map((node) => (
              <div key={node.organization.id} className="space-y-1">
                {/* Organization Header */}
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {node.organization.name}
                    </span>
                  </div>
                  <span className="text-[9px] border border-border px-1 rounded-sm text-muted-foreground uppercase">
                    {node.organization.role}
                  </span>
                </div>

                {/* Workspaces List */}
                <div className="space-y-0.5">
                  {node.workspaces.map((workspace) => {
                    const isActive = currentWorkspace.id === workspace.id;
                    return (
                      <button
                        key={workspace.id}
                        onClick={() => handleSelect(workspace.id)}
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-2 text-sm font-serif transition-colors hover:bg-surface-hover rounded-sm group",
                          isActive && "bg-surface font-bold"
                        )}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Briefcase
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isActive
                                ? "text-foreground"
                                : "text-muted group-hover:text-foreground"
                            )}
                          />
                          <span className="truncate">{workspace.name}</span>
                        </div>
                        {isActive && (
                          <Check className="h-3.5 w-3.5 ml-2 text-brand-primary" />
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
