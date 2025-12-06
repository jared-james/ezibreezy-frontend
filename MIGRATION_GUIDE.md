# Migration Guide: Client-Side API → Server Actions

## Overview

We're migrating from client-side API calls (using `apiClient` from `@/lib/api/index`) to Server Actions for better security with HttpOnly cookies.

## Architecture

**Before:**
```
Browser → apiClient (client-side) → NestJS Backend
```

**After:**
```
Browser → Server Actions → serverFetch → NestJS Backend
```

## Migration Patterns

### Pattern 1: Data Fetching in Server Components

**Before (Client Component):**
```typescript
"use client";
import { useEffect, useState } from "react";
import { listMedia } from "@/lib/api/media";

export default function MediaPage() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    listMedia({ rootOnly: true }).then(setMedia);
  }, []);

  return <div>{/* render */}</div>;
}
```

**After (Server Component):**
```typescript
import { listMediaAction } from "@/app/actions/media";

export default async function MediaPage({ params }: { params: { workspace: string } }) {
  const result = await listMediaAction(params.workspace, { rootOnly: true });

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return <MediaGrid media={result.data.data} />;
}
```

### Pattern 2: Mutations from Client Components

**Before:**
```typescript
"use client";
import { uploadMedia } from "@/lib/api/media";

function UploadButton() {
  const handleUpload = async (file: File) => {
    const result = await uploadMedia(file);
    // ...
  };

  return <button onClick={() => handleUpload(file)}>Upload</button>;
}
```

**After:**
```typescript
"use client";
import { uploadMediaAction } from "@/app/actions/media";
import { useParams } from "next/navigation";

function UploadButton() {
  const params = useParams();
  const workspaceId = params.workspace as string;

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMediaAction(formData, workspaceId);
    if (result.success) {
      // Success!
    }
  };

  return <button onClick={() => handleUpload(file)}>Upload</button>;
}
```

### Pattern 3: Using useTransition for Better UX

```typescript
"use client";
import { useTransition } from "react";
import { deleteMediaAction } from "@/app/actions/media";

function DeleteButton({ mediaId, workspaceId }: { mediaId: string; workspaceId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMediaAction(mediaId, workspaceId);
      if (result.success) {
        // Revalidate or redirect
      }
    });
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### Pattern 4: Getting Workspace ID

All Server Actions require `workspaceId`. Get it from:

**In Server Components:**
```typescript
export default async function Page({ params }: { params: { workspace: string } }) {
  const workspaceId = params.workspace;
  // ...
}
```

**In Client Components:**
```typescript
import { useParams } from "next/navigation";

function MyComponent() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  // ...
}
```

## File-by-File Migration Checklist

### 1. Media Operations
- ✅ Server Actions created: `app/actions/media.ts`
- Replace imports:
  - `@/lib/api/media` → `@/app/actions/media`
  - `uploadMedia` → `uploadMediaAction`
  - `listMedia` → `listMediaAction`
  - etc.

### 2. Integration Operations
- ✅ Server Actions created: `app/actions/integrations.ts`
- Replace imports:
  - `@/lib/api/integrations` → `@/app/actions/integrations`
  - `getConnections` → `getConnectionsAction`
  - `searchLocations` → `searchLocationsAction`
  - etc.

### 3. Publishing Operations
- ✅ Server Actions created: `app/actions/publishing.ts`
- Replace imports:
  - `@/lib/api/publishing` → `@/app/actions/publishing`
  - `createPost` → `createPostAction`
  - `getContentLibrary` → `getContentLibraryAction`
  - etc.

## Common Pitfalls

### ❌ Don't: Call Server Actions in Server Components for mutations
```typescript
// BAD - Server Components can't handle user interactions
export default async function Page() {
  const handleClick = async () => {
    await deleteMediaAction(...); // Won't work!
  };
}
```

### ✅ Do: Pass Server Actions to Client Components
```typescript
// page.tsx (Server Component)
import DeleteButton from "./delete-button";

export default async function Page() {
  return <DeleteButton />;
}

// delete-button.tsx (Client Component)
"use client";
import { deleteMediaAction } from "@/app/actions/media";

export default function DeleteButton() {
  const handleClick = async () => {
    await deleteMediaAction(...); // Works!
  };
  // ...
}
```

## Testing Strategy

1. Test auth flow (signup already done ✅)
2. Test media upload/list/delete
3. Test integrations connect/disconnect
4. Test post creation/scheduling
5. Verify HttpOnly cookies are set correctly
6. Check for any 401 errors

## Next Steps

1. Migrate one page at a time
2. Test each page thoroughly
3. Once all pages work, delete `lib/api/index.ts` (client-side apiClient)
4. Keep type definitions in `lib/api/*.ts` for reuse
