// components/post-editor/threads-preview.tsx

import { memo } from "react";
import { Heart, MessageCircle, Repeat2, Send, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThreadMessageAugmented } from "@/lib/types/editorial";
import { renderCaptionWithHashtags } from "./render-caption";

interface ThreadsPreviewProps {
  caption: string;
  mediaPreview: string[];
  mediaType?: "text" | "image" | "video";
  threadMessages: ThreadMessageAugmented[];
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
}

const ProfileAvatar = ({
  size,
  avatarUrl,
  primaryName,
}: {
  size: number;
  avatarUrl: string | null;
  primaryName: string;
}) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={primaryName}
        className="shrink-0 rounded-full border border-[--border] bg-[--surface] object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="shrink-0 rounded-full border border-[--border] bg-[--muted]"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

const MediaGrid = ({ images, mediaType = "image" }: { images: string[]; mediaType?: "text" | "image" | "video" }) => {
  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-xl border border-[--border] bg-[--muted]",
        images.length === 1 ? "max-h-[300px]" : "h-48 grid grid-cols-2 gap-0.5"
      )}
    >
      {images.slice(0, 4).map((src, index) => (
        <div key={index} className="relative overflow-hidden">
          {mediaType === "video" ? (
            <video
              src={src}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={src}
              alt={`Media ${index + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

function ThreadsPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  threadMessages,
  platformUsername,
  displayName,
  avatarUrl,
}: ThreadsPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  const mainPostImages = mediaPreview.slice(0, 4);
  const hasThread = threadMessages.length > 0;

  return (
    <div className="mx-auto w-full max-w-sm bg-[--surface] border border-[--border] rounded-lg overflow-hidden">
      {/* Main Post */}
      <div className="relative p-4">
        {hasThread && (
          <div
            className="absolute left-[35.5px] top-[62px] z-0 w-0.5 bg-[--border]"
            style={{ bottom: "20px" }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 flex items-start gap-3">
          <div className="flex shrink-0 flex-col items-center" style={{ width: 40 }}>
            <ProfileAvatar size={40} avatarUrl={avatarUrl} primaryName={primaryName} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm">
              <span className="truncate font-bold text-[--foreground]">{primaryName}</span>
              <span className="shrink-0 text-[--muted-foreground]">· now</span>
            </div>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-normal text-[--foreground]">
              {renderCaptionWithHashtags(caption)}
            </p>

            {mainPostImages.length > 0 ? (
              <MediaGrid images={mainPostImages} mediaType={mediaType} />
            ) : (
              caption.length === 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-[--background] p-2 text-sm text-[--muted-foreground]">
                  <ImageIcon className="h-4 w-4" />
                  No media attached.
                </div>
              )
            )}

            <div className="mt-3 flex items-center gap-4 text-[--muted-foreground]">
              <Heart className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
              <MessageCircle className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
              <Repeat2 className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
              <Send className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
            </div>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      {threadMessages.map((message, index) => {
        const isLastMessage = index === threadMessages.length - 1;

        return (
          <div
            key={index}
            className={cn("relative z-10 px-4", isLastMessage ? "pb-4" : "pb-3")}
          >
            {!isLastMessage && (
              <div
                className="absolute left-[35.5px] top-0 z-0 h-full w-0.5 bg-[--border]"
                aria-hidden="true"
              />
            )}

            <div className="flex items-start gap-3">
              <div
                className="relative z-10 flex shrink-0 flex-col items-center"
                style={{ width: 40 }}
              >
                <ProfileAvatar size={40} avatarUrl={avatarUrl} primaryName={primaryName} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="truncate font-bold text-[--foreground]">{primaryName}</span>
                  <span className="shrink-0 text-[--muted-foreground]">· now</span>
                </div>

                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-normal text-[--foreground]">
                  {renderCaptionWithHashtags(message.content)}
                </p>

                {(message.mediaPreviews?.length || 0) > 0 && (
                  <MediaGrid images={message.mediaPreviews || []} mediaType={mediaType} />
                )}

                <div className="mt-3 flex items-center gap-4 text-[--muted-foreground]">
                  <Heart className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
                  <MessageCircle className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
                  <Repeat2 className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
                  <Send className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="p-3 text-xs text-[--muted-foreground] text-center italic border-t border-[--border]">
        Threads Preview
      </div>
    </div>
  );
}

export default memo(ThreadsPreview);
