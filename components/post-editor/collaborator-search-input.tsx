// components/post-editor/collaborator-search-input.tsx

"use client";

import { useState, KeyboardEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, X, Loader2, AlertCircle } from "lucide-react";
import { searchInstagramUser, InstagramUserSearchResult } from "@/lib/api/integrations";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CollaboratorSearchInputProps {
  selectedCollaborators: InstagramUserSearchResult[];
  onCollaboratorsChange: (collaborators: InstagramUserSearchResult[]) => void;
  integrationId: string | null;
}

const MAX_COLLABORATORS = 5;

export default function CollaboratorSearchInput({
  selectedCollaborators,
  onCollaboratorsChange,
  integrationId,
}: CollaboratorSearchInputProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const searchMutation = useMutation({
    mutationFn: async (usernameToSearch: string) => {
      if (!integrationId) {
        throw new Error("Instagram account not selected");
      }
      return searchInstagramUser(usernameToSearch, integrationId);
    },
    onSuccess: (data) => {
      // Check if already selected
      if (selectedCollaborators.some((c) => c.id === data.id)) {
        setError("User already added");
        return;
      }

      // Add to selected collaborators
      onCollaboratorsChange([...selectedCollaborators, data]);
      setUsername("");
      setError(null);
    },
    onError: (error: any) => {
      if (error.response?.status === 404) {
        setError("No user found. Please enter the exact username.");
      } else {
        setError(error.message || "Failed to search user");
      }
    },
  });

  const handleSearch = () => {
    if (!username.trim()) return;

    if (selectedCollaborators.length >= MAX_COLLABORATORS) {
      setError(`Maximum ${MAX_COLLABORATORS} collaborators allowed`);
      return;
    }

    // Remove @ if user included it
    const cleanUsername = username.trim().replace(/^@/, "");
    setError(null);
    searchMutation.mutate(cleanUsername);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleRemove = (collaboratorId: string) => {
    onCollaboratorsChange(
      selectedCollaborators.filter((c) => c.id !== collaboratorId)
    );
  };

  const isMaxReached = selectedCollaborators.length >= MAX_COLLABORATORS;

  return (
    <div className="relative animate-in fade-in-50">
      <label htmlFor="collaborators" className="eyebrow mb-2 flex items-center">
        Invite Collaborators
        {selectedCollaborators.length > 0 && (
          <span className="ml-2 text-xs text-muted-foreground">
            ({selectedCollaborators.length}/{MAX_COLLABORATORS})
          </span>
        )}
      </label>

      {/* Selected Collaborators */}
      {selectedCollaborators.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedCollaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1"
            >
              <img
                src={collaborator.thumbnailUrl}
                alt={collaborator.username}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="text-sm">@{collaborator.username}</span>
              <button
                type="button"
                onClick={() => handleRemove(collaborator.id)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <UserPlus className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="collaborators"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? "Max collaborators reached" : "Enter exact username..."}
          className={cn(
            "h-9 pl-8 pr-8",
            error && "border-error"
          )}
          disabled={isMaxReached || searchMutation.isPending}
          autoComplete="off"
        />
        {searchMutation.isPending && (
          <Loader2 className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-error">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="mt-1 text-xs text-muted-foreground">
        Press Enter to search. Maximum {MAX_COLLABORATORS} collaborators.
      </p>
    </div>
  );
}
