// components/post-editor/x-preview.tsx

import { memo } from "react";
import { MessageSquare, Repeat2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThreadMessageAugmented } from "@/lib/types/editorial";
import { renderCaptionWithHashtags } from "./render-caption";

interface XPreviewProps {
  caption: string;
  mediaPreview: string[];
  threadMessages: ThreadMessageAugmented[];
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  postType?: "text" | "image" | "video";
}

const MediaGrid = ({ images, mediaType = "image" }: { images: string[]; mediaType?: "text" | "image" | "video" }) => {
  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-xl border border-border bg-muted",
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
              isFirstOfThree && "row-span-2"
            )}
          >
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
                className="w-full h-full object-cover transition-opacity hover:opacity-95"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

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
        className="shrink-0 rounded-full border border-border bg-surface object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="shrink-0 rounded-full border border-border bg-muted"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

const XPostFooter = ({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: number;
}) => (
  <div className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand-primary">
    <Icon className="h-4 w-4" />
    <span className="mt-px">{value}</span>
  </div>
);

function XPreview({
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

  const mainPostImages = mediaPreview.slice(0, 4);
  const hasThread = threadMessages.length > 0;

  return (
    <div className="mx-auto w-full max-w-sm ">
      <div className="relative p-4">
        {hasThread && (
          <div
            className="absolute left-[35.5px] top-[62px] z-0 w-px bg-border"
            style={{ bottom: "20px" }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 flex items-start gap-3">
          <div
            className="flex shrink-0 flex-col items-center"
            style={{ width: 40 }}
          >
            <ProfileAvatar
              size={40}
              avatarUrl={avatarUrl}
              primaryName={primaryName}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm">
              <span className="truncate font-bold text-foreground">
                {primaryName}
              </span>
              {handle && (
                <span className="shrink text-muted-foreground truncate">
                  {handle}
                </span>
              )}
              <span className="shrink-0 text-muted-foreground">· Now</span>
            </div>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-normal text-foreground">
              {renderCaptionWithHashtags(caption)}
            </p>

            {mainPostImages.length > 0 ? (
              <MediaGrid images={mainPostImages} mediaType={postType} />
            ) : (
              (caption.length === 0 || caption.trim() === "") &&
              postType !== "text" && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-background p-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  No media attached.
                </div>
              )
            )}

            <div className="mt-3 flex justify-between px-2">
              <XPostFooter icon={MessageSquare} value={0} />
              <XPostFooter icon={Repeat2} value={0} />
            </div>
          </div>
        </div>
      </div>

      {threadMessages.map((message, index) => {
        const isLastMessage = index === threadMessages.length - 1;

        return (
          <div
            key={index}
            className={cn(
              "relative z-10 px-4",
              isLastMessage ? "pb-4" : "pb-3"
            )}
          >
            {!isLastMessage && (
              <div
                className="absolute left-[35.5px] top-0 z-0 h-full w-px bg-border"
                aria-hidden="true"
              />
            )}

            <div className="flex items-start gap-3">
              <div
                className="relative z-10 flex shrink-0 flex-col items-center"
                style={{ width: 40 }}
              >
                <ProfileAvatar
                  size={40}
                  avatarUrl={avatarUrl}
                  primaryName={primaryName}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="truncate font-bold text-foreground">
                    {primaryName}
                  </span>
                  {handle && (
                    <span className="shrink text-muted-foreground truncate">
                      {handle}
                    </span>
                  )}
                  <span className="shrink-0 text-muted-foreground">· Now</span>
                </div>

                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-normal text-foreground">
                  {renderCaptionWithHashtags(message.content)}
                </p>

                {(message.mediaPreviews?.length || 0) > 0 && (
                  <MediaGrid images={message.mediaPreviews || []} mediaType={postType} />
                )}

                <div className="mt-3 flex justify-between px-2">
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

export default memo(XPreview);
