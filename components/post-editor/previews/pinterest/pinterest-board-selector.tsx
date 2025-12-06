// components/post-editor/previews/pinterest/pinterest-board-selector.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertCircle, Plus, X, Check } from "lucide-react";
import {
  getPinterestBoardsAction,
  createPinterestBoardAction,
} from "@/app/actions/integrations";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PinterestBoardSelectorProps {
  integrationId: string | null;
  selectedBoardId: string | null;
  onBoardSelect: (boardId: string) => void;
}

export function PinterestBoardSelector({
  integrationId,
  selectedBoardId,
  onBoardSelect,
}: PinterestBoardSelectorProps) {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const {
    data: boards = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pinterest-boards", integrationId, workspaceId],
    queryFn: async () => {
      if (!integrationId || !workspaceId) return [];
      const result = await getPinterestBoardsAction(integrationId, workspaceId);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch boards");
      }
      return result.data;
    },
    enabled: !!integrationId && !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!integrationId) throw new Error("No account selected");
      if (!newBoardName.trim()) throw new Error("Board name is required");
      if (!workspaceId) throw new Error("No workspace selected");

      const result = await createPinterestBoardAction(
        {
          integrationId,
          name: newBoardName.trim(),
          privacy: isSecret ? "SECRET" : "PUBLIC",
        },
        workspaceId
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to create board");
      }

      return result.data;
    },
    onSuccess: (newBoard) => {
      toast.success("Board created successfully");
      queryClient.invalidateQueries({
        queryKey: ["pinterest-boards", integrationId, workspaceId],
      });
      onBoardSelect(newBoard.id);
      setIsCreating(false);
      setNewBoardName("");
      setIsSecret(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create board");
    },
  });

  if (!integrationId) {
    return (
      <div className="text-xs text-muted-foreground italic">
        Select a Pinterest account to load boards.
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-border animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">New Board</span>
          <button
            onClick={() => setIsCreating(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          <Input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Board Name (e.g. Design Ideas)"
            className="h-8 text-xs bg-background"
            autoFocus
          />

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            Keep this board secret
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs flex-1"
            onClick={() => setIsCreating(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="h-7 text-xs flex-1 gap-1.5"
            onClick={() => createMutation.mutate()}
            disabled={!newBoardName.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Create Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Select Board <span className="text-red-500">*</span>
        </label>
        {!isLoading && !isError && (
          <button
            onClick={() => setIsCreating(true)}
            className="text-[10px] flex items-center gap-1 text-brand-primary hover:underline font-medium"
          >
            <Plus className="h-3 w-3" />
            New Board
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground h-9 px-3 border border-border rounded-md bg-muted/10">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading boards...
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-xs text-error h-9 px-3 border border-error/30 bg-error/5 rounded-md">
          <AlertCircle className="h-3 w-3" />
          Failed to load boards
        </div>
      ) : (
        <Select value={selectedBoardId || ""} onValueChange={onBoardSelect}>
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Choose a board..." />
          </SelectTrigger>
          <SelectContent>
            {boards.length === 0 ? (
              <div className="p-2 text-xs text-center text-muted-foreground">
                No boards found
              </div>
            ) : (
              boards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.name} {board.privacy === "SECRET" ? "🔒" : ""}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
