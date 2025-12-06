# Example Refactor: Integrations Settings Component

## Before (Client-Side API)

```typescript
// components/settings/integrations/index.tsx
"use client";

import { getConnections, disconnectAccount } from "@/lib/api/integrations";
import { useQuery } from "@tanstack/react-query";

export function IntegrationsSettings() {
  // ❌ OLD: Client-side API call via useQuery
  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections, // ← Client-side fetch
  });

  const handleDisconnect = async (platformId: string, accountId: string) => {
    // ❌ OLD: Client-side API call
    await disconnectAccount(platformId, accountId);
    queryClient.invalidateQueries({ queryKey: ["connections"] });
  };

  // ...
}
```

## After (Server Actions)

```typescript
// components/settings/integrations/index.tsx
"use client";

import { disconnectAccountAction } from "@/app/actions/integrations";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function IntegrationsSettings() {
  const params = useParams();
  const workspaceId = params.workspace as string;

  // ✅ NEW: useQuery still works, but calls Server Action
  const { data: connections = [] } = useQuery({
    queryKey: ["connections", workspaceId],
    queryFn: async () => {
      const result = await getConnectionsAction(workspaceId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });

  const handleDisconnect = async (platformId: string, accountId: string) => {
    // ✅ NEW: Call Server Action
    const result = await disconnectAccountAction(platformId, accountId, workspaceId);
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    } else {
      toast.error(result.error);
    }
  };

  // ...
}
```

## Key Changes:

1. **Import Server Actions instead of client-side API**
   - `@/lib/api/integrations` → `@/app/actions/integrations`
   - `getConnections` → `getConnectionsAction`

2. **Get workspace ID from URL params**
   ```typescript
   const params = useParams();
   const workspaceId = params.workspace as string;
   ```

3. **Wrap Server Actions in useQuery**
   ```typescript
   queryFn: async () => {
     const result = await getConnectionsAction(workspaceId);
     if (!result.success) throw new Error(result.error);
     return result.data!;
   }
   ```

4. **Handle error responses**
   ```typescript
   const result = await disconnectAccountAction(...);
   if (!result.success) {
     toast.error(result.error);
   }
   ```

## Benefits:

✅ **Security**: HttpOnly cookies, no token exposure
✅ **Architecture**: Next.js acts as BFF (Backend for Frontend)
✅ **DX**: Same patterns (useQuery, mutations) still work
✅ **Type Safety**: Full TypeScript support maintained
