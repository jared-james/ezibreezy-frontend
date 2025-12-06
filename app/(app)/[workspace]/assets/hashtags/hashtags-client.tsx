// app/(app)/assets/hashtags/hashtags-client.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listHashtagGroupsAction,
  createHashtagGroupAction,
  updateHashtagGroupAction,
  deleteHashtagGroupAction,
} from "@/app/actions/hashtags";
import { HashtagGroup } from "@/lib/types/hashtags";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Hash, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface HashtagsClientProps {
  workspaceId: string;
  initialData?: HashtagGroup[];
}

export default function HashtagsClient({
  workspaceId,
  initialData,
}: HashtagsClientProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<HashtagGroup | null>(null);
  const [groupName, setGroupName] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");

  // Fetch hashtag groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["hashtag-groups", workspaceId],
    queryFn: async () => {
      const result = await listHashtagGroupsAction(workspaceId);
      if (!result.success) throw new Error(result.error);
      return result.data || [];
    },
    initialData,
    enabled: !!workspaceId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; content: string }) => {
      const result = await createHashtagGroupAction(
        {
          name: data.name,
          content: data.content,
        },
        workspaceId
      );
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hashtag-groups"] });
      toast.success("Hashtag group created successfully");
      handleCloseDialog();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create group";
      toast.error(errorMessage);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; content: string }) => {
      const result = await updateHashtagGroupAction(
        data.id,
        {
          name: data.name,
          content: data.content,
        },
        workspaceId
      );
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hashtag-groups"] });
      toast.success("Hashtag group updated successfully");
      handleCloseDialog();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update group";
      toast.error(errorMessage);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteHashtagGroupAction(id, workspaceId);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hashtag-groups"] });
      toast.success("Hashtag group deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete group";
      toast.error(errorMessage);
    },
  });

  const handleOpenDialog = (group?: HashtagGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupName(group.name);
      // Parse existing hashtags from content
      const existingHashtags = group.content
        .split(/\s+/)
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter((tag) => tag.length > 0);
      setHashtags(existingHashtags);
    } else {
      setEditingGroup(null);
      setGroupName("");
      setHashtags([]);
    }
    setHashtagInput("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGroup(null);
    setGroupName("");
    setHashtags([]);
    setHashtagInput("");
  };

  const handleAddHashtag = () => {
    const trimmed = hashtagInput.trim().replace(/^#/, "");
    if (!trimmed) return;

    if (hashtags.includes(trimmed.toLowerCase())) {
      toast.error("This hashtag is already in the list");
      return;
    }

    setHashtags([...hashtags, trimmed.toLowerCase()]);
    setHashtagInput("");
  };

  const handleHashtagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (hashtags.length === 0) {
      toast.error("Please add at least one hashtag");
      return;
    }

    if (groupName.length > 100) {
      toast.error("Name must be 100 characters or less");
      return;
    }

    // Format hashtags as space-separated string with # prefix
    const content = hashtags.map((tag) => `#${tag}`).join(" ");

    if (editingGroup) {
      updateMutation.mutate({
        id: editingGroup.id,
        name: groupName,
        content,
      });
    } else {
      createMutation.mutate({
        name: groupName,
        content,
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b-4 border-double border-foreground pb-6 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-2">Assets</p>
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Hashtag Library
            </h1>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="gap-2 shrink-0"
            variant="primary"
          >
            <Plus className="h-4 w-4" />
            New Group
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="border-b-4 border-double border-foreground pb-4 mb-6">
                <Hash className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="font-serif text-2xl font-bold uppercase tracking-tight">
                  No Hashtag Groups Yet
                </h2>
              </div>
              <p className="font-serif text-muted-foreground mb-6 italic">
                Create your first hashtag group to quickly insert curated
                hashtags into your posts across different platforms and content
                niches.
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Group
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border border-border p-4 hover:border-foreground transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-lg truncate">
                      {group.name}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground mt-1 line-clamp-2">
                      {group.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(group)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(group.id, group.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs font-serif text-muted-foreground italic">
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingGroup ? "Edit Hashtag Group" : "New Hashtag Group"}
            </DialogTitle>
            <DialogDescription className="font-serif italic">
              {editingGroup
                ? "Update your hashtag group details"
                : "Create a new group of hashtags to use in your posts"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="font-serif text-sm font-medium"
                >
                  Group Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Tech Startup Set"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={100}
                  className="font-serif"
                />
                <p className="text-xs text-muted-foreground font-serif italic">
                  Max 100 characters
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hashtag-input"
                  className="font-serif text-sm font-medium"
                >
                  Add Hashtags
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="hashtag-input"
                      placeholder="e.g., tech or #startup"
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={handleHashtagInputKeyDown}
                      className="font-mono pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddHashtag}
                    variant="outline"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-serif italic">
                  Press Enter or click + to add each hashtag
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-serif text-sm font-medium">
                  Hashtags in Group ({hashtags.length})
                </label>
                <div className="min-h-24 border border-border p-3 bg-surface-hover rounded-md">
                  {hashtags.length === 0 ? (
                    <p className="font-serif text-sm text-muted-foreground italic text-center py-4">
                      No hashtags added yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleRemoveHashtag(tag)}
                          className="flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 font-mono text-sm text-brand-primary-foreground transition-opacity hover:opacity-80"
                        >
                          <span>#{tag}</span>
                          <X className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingGroup ? "Updating..." : "Creating..."}
                  </>
                ) : editingGroup ? (
                  "Update Group"
                ) : (
                  "Create Group"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
