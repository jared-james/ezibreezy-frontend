// app/(app)/ideas/components/ai-briefing.tsx

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Clipping, generateClippings } from "@/lib/api/ideas";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AIBriefingProps {
  onNewBriefingGenerated: (clippings: Clipping[]) => void;
}

export default function AIBriefing({
  onNewBriefingGenerated,
}: AIBriefingProps) {
  const [prompt, setPrompt] = useState("");

  const mutation = useMutation({
    mutationFn: (newPrompt: string) => generateClippings(newPrompt),
    onSuccess: (data) => {
      onNewBriefingGenerated(data);
    },
    onError: (error) => {
      console.error("Error generating ideas:", error);
      alert("Failed to generate ideas. Please check the console.");
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    mutation.mutate(prompt);
  };

  return (
    <div className="bg-surface border border-border p-6">
      <p className="eyebrow mb-2 text-foreground">Step 1: Write your Memo</p>

      <div className="space-y-4">
        <Textarea
          rows={8}
          placeholder="Brief the AI on your recent activities, a topic of interest, or a half-formed thought..."
          className="min-h-32"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={mutation.isPending}
        />

        <div className="w-full border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-4 hover:border-foreground transition-colors bg-surface cursor-pointer">
          <Paperclip className="w-6 h-6 text-muted-foreground mb-2" />
          <p className="font-serif text-sm text-foreground/70">
            Attach documents or images for context
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || !prompt.trim()}
            variant="primary"
            className="w-48 px-8 gap-2"
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
