// app/(app)/ideas/components/ai-briefing.tsx

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clipping } from "@/lib/types/editorial";
import { generateClippings } from "@/lib/api/ideas";

interface AIBriefingProps {
  onNewBriefingGenerated: (clippings: Clipping[]) => void;
}

export default function AIBriefing({
  onNewBriefingGenerated,
}: AIBriefingProps) {
  const [prompt, setPrompt] = useState("");

  const mutation = useMutation({
    mutationFn: generateClippings,
    onSuccess: (data) => {
      onNewBriefingGenerated(data);
    },
    onError: (error: any) => {
      console.error("Error generating ideas:", error);
      toast.error(
        `Failed to generate ideas: ${
          error?.response?.data?.message || "Please try again later."
        }`
      );
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    mutation.mutate(prompt);
  };

  return (
    <div className="border border-border bg-surface p-6">
      <p className="eyebrow mb-2 text-foreground">Step 1: Write your Memo</p>

      <div className="space-y-4">
        <Textarea
          rows={8}
          placeholder="Brief the AI on your recent activities, a topic of interest, or a half-formed thought..."
          className="min-h-32"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={mutation.isPending}
        />

        <div className="flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-surface p-4 text-center transition-colors hover:border-foreground">
          <Paperclip className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="font-serif text-sm text-foreground/70">
            Attach documents or images for context
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || !prompt.trim()}
            variant="primary"
            className="flex w-48 items-center justify-center gap-2 px-8"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
