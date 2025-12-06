// app/(app)/ideas/components/latest-briefing.tsx

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RefreshCw,
  // PenLine,
  BookmarkPlus,
  Lightbulb,
  Loader2,
} from "lucide-react";
// import EditClippingModal from "./edit-clipping-modal"; // COMMENTED OUT - refactoring modal functionality
import type { Clipping as GeneratedClipping } from "@/lib/types/ideas";
// import { saveClippingAsDraftAction } from "@/app/actions/ideas"; // COMMENTED OUT - ideas feature disabled
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useClientData } from "@/lib/hooks/use-client-data"; // Updated import

interface LatestBriefingProps {
  clippings: GeneratedClipping[];
}

export default function LatestBriefing({ clippings }: LatestBriefingProps) {
  // const [selectedIdea, setSelectedIdea] = useState<GeneratedClipping | null>( // COMMENTED OUT - modal removed
  //   null
  // );
  const queryClient = useQueryClient();

  // Consolidate user and connection fetching
  const { userId, organizationId, connections, workspaceId } = useClientData();

  // COMMENTED OUT - ideas feature disabled
  const saveMutation = useMutation({
    mutationFn: async (_payload: {
      userId: string;
      integrationId: string;
      title?: string;
      content: string;
    }): Promise<{ title?: string; content: string }> => {
      // if (!workspaceId) throw new Error("Workspace ID missing");
      // const result = await saveClippingAsDraftAction(payload, workspaceId);
      // if (!result.success || !result.data) {
      //   throw new Error(result.error || "Failed to save clipping");
      // }
      // return result.data;
      throw new Error("Ideas feature is currently disabled");
    },
    onSuccess: (data) => {
      toast.success(
        `Idea "${
          data.title || data.content.substring(0, 30)
        }..." saved as a draft!`
      );
      queryClient.invalidateQueries({ queryKey: ["contentLibrary"] }); // Invalidate content library query
      queryClient.invalidateQueries({ queryKey: ["scheduledPosts"] }); // Invalidate old calendar query in case it's still running
    },
    onError: (error: Error) => {
      console.error("Error saving clipping:", error);
      toast.error(
        `Failed to save clipping: ${
          error.message || "An unknown error occurred."
        }`
      );
    },
  });

  const handleSaveClipping = (idea: GeneratedClipping) => {
    if (!userId || !organizationId) {
      return toast.error("User context data missing. Cannot save.");
    }

    // Use the first available integration for the draft post's required link
    // This assumes the user has at least one account connected, which is a good prerequisite for saving a draft post.
    const defaultIntegrationId = connections[0]?.id;
    if (!defaultIntegrationId) {
      return toast.error("No connected accounts found. Cannot save draft.");
    }

    saveMutation.mutate({
      userId: userId,
      integrationId: defaultIntegrationId,
      title: idea.title,
      content: idea.body,
    });
  };

  if (clippings.length === 0) {
    return (
      <div className="pt-4">
        <h2 className="mb-6 border-b border-border pb-3 font-serif text-2xl font-bold text-foreground">
          Latest Briefing
        </h2>
        <div className="rounded-lg border-2 border-dashed border-border bg-surface py-12 text-center">
          <Lightbulb className="mb-3 h-12 w-12 mx-auto text-muted-foreground" />
          <h4 className="mb-2 font-serif text-lg font-medium text-foreground">
            Your generated ideas will appear here
          </h4>
          <p className="font-serif text-sm text-foreground/60">
            Write a memo above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-4">
        <h2 className="mb-6 border-b border-border pb-3 font-serif text-2xl font-bold text-foreground">
          Latest Briefing
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {clippings.map((idea, index) => (
            <div
              key={index}
              className="flex flex-col justify-between border border-border bg-card p-5"
            >
              <div>
                <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
                  {idea.title}
                </h3>
                <p className="mb-4 font-serif text-sm leading-relaxed text-foreground/80">
                  {idea.body}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Remix with AI"
                    disabled={saveMutation.isPending}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {/* COMMENTED OUT - modal functionality being refactored */}
                  {/* <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Refine Manually"
                    onClick={() => setSelectedIdea(idea)}
                    disabled={saveMutation.isPending}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button> */}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="gap-2"
                  onClick={() => handleSaveClipping(idea)}
                  disabled={
                    saveMutation.isPending ||
                    !userId ||
                    connections.length === 0
                  }
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" />
                  )}
                  <span>Save Clipping</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENTED OUT - modal functionality being refactored */}
      {/* {selectedIdea && (
        <EditClippingModal
          isOpen={!!selectedIdea}
          onClose={() => setSelectedIdea(null)}
          idea={selectedIdea}
        />
      )} */}
    </>
  );
}
