// // components/media-room/media-list.tsx

// "use client";

// import { useMemo } from "react";
// import { Loader2, ImageOff } from "lucide-react";
// import { useMediaList } from "@/lib/hooks/use-media";
// import { useMediaRoomStore } from "@/lib/store/media-room-store";
// import type { MediaFilters } from "@/lib/api/media";
// import MediaListItem from "./media-list-item";

// interface MediaListProps {
//   integrationId: string | null;
// }

// export default function MediaList({ integrationId }: MediaListProps) {
//   // Select individual state values to build filters
//   const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
//   const searchQuery = useMediaRoomStore((s) => s.searchQuery);
//   const typeFilter = useMediaRoomStore((s) => s.typeFilter);
//   const selectedTagIds = useMediaRoomStore((s) => s.selectedTagIds);
//   const showUsedOnly = useMediaRoomStore((s) => s.showUsedOnly);
//   const showUnusedOnly = useMediaRoomStore((s) => s.showUnusedOnly);
//   const sortBy = useMediaRoomStore((s) => s.sortBy);
//   const sortOrder = useMediaRoomStore((s) => s.sortOrder);
//   const selectItem = useMediaRoomStore((s) => s.selectItem);
//   const openDetailPanel = useMediaRoomStore((s) => s.openDetailPanel);

//   // Memoize filters object
//   const filters = useMemo<MediaFilters>(() => {
//     const f: MediaFilters = {
//       sortBy,
//       order: sortOrder,
//     };

//     if (currentFolderId) {
//       f.folderId = currentFolderId;
//     } else {
//       f.rootOnly = true;
//     }

//     if (searchQuery.trim()) {
//       f.search = searchQuery.trim();
//     }

//     if (typeFilter !== "all") {
//       f.type = typeFilter;
//     }

//     if (selectedTagIds.length > 0) {
//       f.tagIds = selectedTagIds;
//     }

//     if (showUsedOnly) {
//       f.isUsed = true;
//     }

//     if (showUnusedOnly) {
//       f.isUnused = true;
//     }

//     return f;
//   }, [
//     currentFolderId,
//     searchQuery,
//     typeFilter,
//     selectedTagIds,
//     showUsedOnly,
//     showUnusedOnly,
//     sortBy,
//     sortOrder,
//   ]);

//   const { data, isLoading, isError, error } = useMediaList(
//     integrationId,
//     filters
//   );

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-24">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="border border-error bg-error/5 p-6 text-center">
//         <p className="font-serif text-sm text-error">
//           Error loading media: {error?.message}
//         </p>
//       </div>
//     );
//   }

//   const mediaItems = data?.data || [];

//   if (mediaItems.length === 0) {
//     return (
//       <div className="py-16 text-center border-2 border-dashed border-border rounded-lg">
//         <ImageOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
//         <p className="font-serif text-lg text-muted-foreground italic">
//           No media found
//         </p>
//         <p className="font-serif text-sm text-muted-foreground mt-1">
//           Upload some files or adjust your filters
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="space-y-2">
//         {mediaItems.map((item) => (
//           <MediaListItem
//             key={item.id}
//             item={item}
//             integrationId={integrationId}
//             onSelect={selectItem}
//             onOpenDetail={openDetailPanel}
//           />
//         ))}
//       </div>

//       {data?.pagination && (
//         <div className="mt-6 text-center">
//           <p className="font-serif text-sm text-muted-foreground">
//             Showing {mediaItems.length} of {data.pagination.total} items
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
