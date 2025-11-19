// app/(app)/editorial/components/x-preview.tsx

import { MessageSquare, Repeat2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThreadMessage } from "@/lib/types/editorial";
import type { ThreadMessageAugmented } from "@/app/(app)/ideas/components/edit-modal/distribution-panel"; // Import Augmented type

interface XPreviewProps {
  caption: string;
  mediaPreview: string[]; // Main post mediaPreviews (not mediaIds)
  threadMessages: ThreadMessageAugmented[]; // Updated prop to Augmented type
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  postType?: "text" | "image" | "video";
}

// Helper component for rendering media grid within a tweet
const MediaGrid = ({ images }: { images: string[] }) => {
  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-xl border border-[--border] bg-gray-100 dark:bg-gray-800",
        images.length === 1 ? "max-h-[350px]" : "h-64 grid grid-cols-2 gap-0.5"
      )}
    >
      {images.map((src, index) => {
        const isThreeImages = images.length === 3;
        const isFirstOfThree = isThreeImages && index === 0;

        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden",
              isFirstOfThree ? "row-span-2" : ""
            )}
          >
            <img
              src={src}
              alt={`Media ${index + 1}`}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            />
          </div>
        );
      })}
    </div>
  );
};

// Helper component for the user's avatar in the thread
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
        className="rounded-full border border-[--border] shrink-0 object-cover bg-[--surface]"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border border-[--border] shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

// Main XPreview Component
export default function XPreview({
  caption,
  mediaPreview,
  threadMessages,
  platformUsername,
  displayName,
  avatarUrl,
  postType = "text",
}: XPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const handle = accountName ? `@${accountName}` : "";

  // Main post media is passed as mediaPreview (max 4 already handled by EditorialPage)
  const mainPostImages = mediaPreview;
  const hasThread = threadMessages.length > 0;

  return (
    <div className="w-full bg-[--surface] max-w-sm mx-auto">
      {/* Container for Main Post and Thread Line */}
      <div className="p-4 relative">
        {hasThread && (
          // Thread connecting line (Starts below the main post's avatar)
          <div
            className="absolute left-[35.5px] top-[62px] w-px bg-gray-200 z-0"
            style={{ bottom: "20px" }} // Extends down to just above the last thread post's avatar
            aria-hidden="true"
          />
        )}

        {/* --- MAIN POST --- */}
        <div className="flex items-start gap-3 relative z-10">
          <div
            className="flex flex-col items-center shrink-0"
            style={{ width: 40 }}
          >
            <ProfileAvatar
              size={40}
              avatarUrl={avatarUrl}
              primaryName={primaryName}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold text-[--foreground] truncate">
                {primaryName}
              </span>
              {handle && (
                <span className="text-[--muted-foreground] truncate shrink">
                  {handle}
                </span>
              )}
              <span className="text-[--muted-foreground] shrink-0">· Now</span>
            </div>

            <p className="mt-1 text-[--foreground] whitespace-pre-wrap break-words text-[0.95rem] leading-normal">
              {caption}
            </p>

            {mainPostImages.length > 0 ? (
              <MediaGrid images={mainPostImages} />
            ) : (
              (caption.length === 0 || caption.trim() === "") &&
              postType !== "text" && (
                <div className="mt-3 flex items-center gap-2 p-2 bg-[--background] rounded-md text-sm text-[--muted-foreground]">
                  <ImageIcon className="w-4 h-4" />
                  No media attached.
                </div>
              )
            )}

            <div className="flex justify-between mt-3 px-2">
              <XPostFooter icon={MessageSquare} value={0} />
              <XPostFooter icon={Repeat2} value={0} />
            </div>
          </div>
        </div>
      </div>

      {/* --- THREAD MESSAGES --- */}
      {threadMessages.map((message, index) => {
        const isLastMessage = index === threadMessages.length - 1;

        return (
          <div
            key={index}
            className={cn(
              "px-4 relative z-10",
              isLastMessage ? "pb-4" : "pb-3"
            )}
          >
            {/* Thread connecting line (Only draws if it's NOT the last message) */}
            {!isLastMessage && (
              <div
                className="absolute left-[35.5px] top-0 w-px bg-gray-200 z-0"
                style={{ height: "100%" }}
                aria-hidden="true"
              />
            )}

            <div className="flex items-start gap-3">
              <div
                className="flex flex-col items-center shrink-0"
                style={{ width: 40 }}
              >
                <ProfileAvatar
                  size={40}
                  avatarUrl={avatarUrl}
                  primaryName={primaryName}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold text-[--foreground] truncate">
                    {primaryName}
                  </span>
                  {handle && (
                    <span className="text-[--muted-foreground] truncate shrink">
                      {handle}
                    </span>
                  )}
                  <span className="text-[--muted-foreground] shrink-0">
                    · Now
                  </span>
                </div>
                <p className="mt-1 text-[--foreground] whitespace-pre-wrap break-words text-[0.95rem] leading-normal">
                  {message.content}
                </p>

                {/* Use the mediaPreviews from the augmented message */}
                {(message.mediaPreviews?.length || 0) > 0 && (
                  <MediaGrid images={message.mediaPreviews || []} />
                )}

                <div className="flex justify-between mt-3 px-2">
                  <XPostFooter icon={MessageSquare} value={0} />
                  <XPostFooter icon={Repeat2} value={0} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Redefining XPostFooter outside the main component for cleaner code
const XPostFooter = ({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: number;
}) => (
  <div className="flex items-center gap-1 text-xs text-[--muted-foreground] hover:text-[--brand-primary] transition-colors cursor-pointer">
    <Icon className="w-4 h-4" />
    <span className="mt-[1px]">{value}</span>
  </div>
);
