// app/(app)/editorial/components/x-preview.tsx

import { MessageSquare, Repeat2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPreviewProps {
  caption: string;
  // Updated to accept an array of strings
  mediaPreview: string[] | string | null;
  firstComment: string;
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  postType?: "text" | "image" | "video";
}

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

export default function XPreview({
  caption,
  mediaPreview,
  firstComment,
  platformUsername,
  displayName,
  avatarUrl,
  postType = "text",
}: XPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const handle = accountName ? `@${accountName}` : "";

  // Normalize mediaPreview to an array strictly
  const images = Array.isArray(mediaPreview)
    ? mediaPreview
    : mediaPreview
    ? [mediaPreview]
    : [];

  const ProfileAvatar = ({ size }: { size: number }) => {
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

  const hasThread = firstComment && firstComment.trim().length > 0;

  return (
    <div className="w-full bg-[--surface] border border-[--border] max-w-sm mx-auto">
      {/* First Post Wrapper */}
      <div className="p-4 relative">
        {/* THREAD LINE */}
        {hasThread && (
          <div
            className="absolute left-[35.5px] top-[62px] bottom-2 w-px bg-gray-200 dark:bg-gray-700 z-0"
            aria-hidden="true"
          />
        )}

        <div className="flex items-start gap-3 relative z-10">
          {/* Avatar Column */}
          <div
            className="flex flex-col items-center shrink-0"
            style={{ width: 40 }}
          >
            <ProfileAvatar size={40} />
          </div>

          {/* Content Column */}
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

            {/* MEDIA GRID DISPLAY */}
            {images.length > 0 ? (
              <div
                className={cn(
                  "mt-3 overflow-hidden rounded-xl border border-[--border] bg-gray-100 dark:bg-gray-800",
                  // If 1 image: natural height (with max).
                  // If 2+ images: Fixed height grid to keep it "smaller" and uniform.
                  images.length === 1
                    ? "max-h-[350px]"
                    : "h-64 grid grid-cols-2 gap-0.5"
                )}
              >
                {images.slice(0, 4).map((src, index) => {
                  // Logic for 3 images: 1st image takes up full left column
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
              <XPostFooter icon={MessageSquare} value={0} />
              <XPostFooter icon={MessageSquare} value={0} />
            </div>
          </div>
        </div>
      </div>

      {/* Reply Post */}
      {hasThread && (
        <div className="px-4 pb-4 relative z-10">
          <div className="flex items-start gap-3">
            <div
              className="flex flex-col items-center shrink-0"
              style={{ width: 40 }}
            >
              <ProfileAvatar size={40} />
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
                {firstComment}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
