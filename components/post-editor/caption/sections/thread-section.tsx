// components/post-editor/caption/sections/thread-section.tsx

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreadMessageAugmented } from "@/lib/types/editorial";
import { ThreadTextarea } from "../components/thread-textarea";
import ThreadMediaSelector from "../../media/thread-media-selector";

interface ThreadSectionProps {
  currentThreadMessages: ThreadMessageAugmented[];
  platformId: string;
  updateThreadMessageContent: (
    index: number,
    content: string,
    platformId: string
  ) => void;
  removeThreadMessage: (index: number, platformId: string) => void;
  addThreadMessage: (platformId: string) => void;
  openThreadHashtagModal: (threadIndex: number) => void;
}

export function ThreadSection({
  currentThreadMessages,
  platformId,
  updateThreadMessageContent,
  removeThreadMessage,
  addThreadMessage,
  openThreadHashtagModal,
}: ThreadSectionProps) {
  return (
    <>
      {currentThreadMessages.map((message, index) => {
        // mediaIds contains the UIDs of selected media
        const selectedMediaIds = message.mediaIds || [];

        return (
          <div
            key={index}
            className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border ml-2"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-[0.65rem]">
                  Thread Post {index + 2}
                </p>
                <Button
                  type="button"
                  onClick={() => removeThreadMessage(index, platformId)}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-muted-foreground hover:text-error"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <ThreadTextarea
                value={message.content}
                onChange={(event) =>
                  updateThreadMessageContent(
                    index,
                    event.target.value,
                    platformId
                  )
                }
                placeholder="What's happening next?"
                threadIndex={index}
                onHashtagClick={openThreadHashtagModal}
              />

              <ThreadMediaSelector
                platformId={platformId}
                threadIndex={index}
                selectedMediaIds={selectedMediaIds}
              />
            </div>
          </div>
        );
      })}

      {currentThreadMessages.length < 20 && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => addThreadMessage(platformId)}
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            Add to thread
          </Button>
        </div>
      )}
    </>
  );
}
