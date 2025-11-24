# Media Library API Reference

This document describes the Media Library API for frontend integration.

> **Note**: All endpoints require authentication via Supabase and an `integrationId` query parameter for organization scoping.

---

## Base URL

```
/media
```

---

## Authentication

All requests require:
- Bearer token (Supabase auth)
- `integrationId` query parameter (used to determine organization context)

---

## Media Assets

### List Media

```http
GET /media?integrationId={integrationId}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `integrationId` | UUID | required | Integration for org context |
| `folderId` | UUID | - | Filter by folder |
| `rootOnly` | boolean | false | Only show items not in any folder |
| `tagIds` | UUID[] | - | Filter by tags (comma-separated) |
| `type` | enum | - | `image`, `video`, or `gif` |
| `search` | string | - | Fuzzy search on filename/altText |
| `isFavorite` | boolean | - | Filter favorites |
| `isUsed` | boolean | - | Only items attached to posts |
| `isUnused` | boolean | - | Only items not attached to posts |
| `sortBy` | enum | `createdAt` | `createdAt`, `filename`, `fileSize` |
| `order` | enum | `desc` | `asc` or `desc` |
| `limit` | number | 50 | Max 100 |
| `offset` | number | 0 | Pagination offset |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "url": "https://cdn.example.com/org-id/file.jpg",
      "thumbnailUrl": "https://cdn.example.com/org-id/thumbnails/file.jpg",
      "type": "image/jpeg",
      "filename": "photo.jpg",
      "fileSize": 245000,
      "width": 1920,
      "height": 1080,
      "altText": "A sunset photo",
      "isFavorite": false,
      "folderId": "uuid | null",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "tags": [
        { "id": "uuid", "name": "Campaign", "color": "#FF5733" }
      ],
      "usageCount": 3
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get Single Media

```http
GET /media/:id?integrationId={integrationId}
```

**Response:**

```json
{
  "id": "uuid",
  "url": "https://cdn.example.com/org-id/file.jpg",
  "thumbnailUrl": "https://cdn.example.com/org-id/thumbnails/file.jpg",
  "type": "image/jpeg",
  "filename": "photo.jpg",
  "fileSize": 245000,
  "width": 1920,
  "height": 1080,
  "altText": "A sunset photo",
  "isFavorite": false,
  "folderId": "uuid | null",
  "folder": {
    "id": "uuid",
    "name": "Q1 Campaign"
  },
  "tags": [
    { "id": "uuid", "name": "Campaign", "color": "#FF5733" }
  ],
  "usageCount": 3,
  "usedInPosts": [
    {
      "id": "uuid",
      "title": "Summer Sale Post",
      "status": "scheduled",
      "scheduledAt": "2025-01-20T14:00:00Z",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

---

### Upload Media

```http
POST /media/upload
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The file to upload (max 512MB) |
| `integrationId` | UUID | Integration for org context |

**Accepted File Types:** `jpg`, `jpeg`, `png`, `gif`, `webp`, `mp4`, `mov`

**Response:**

```json
{
  "mediaId": "uuid",
  "url": "https://cdn.example.com/org-id/abc123.jpg",
  "thumbnailUrl": "https://cdn.example.com/org-id/thumbnails/abc123.jpg",
  "width": 1920,
  "height": 1080
}
```

**Notes:**
- Thumbnails are auto-generated for images (400px width, JPEG)
- Dimensions (width/height) are auto-extracted for images
- File hash is computed for duplicate detection

---

### Update Media

```http
PATCH /media/:id?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "filename": "new-name.jpg",
  "altText": "Updated description",
  "isFavorite": true,
  "folderId": "uuid | null"
}
```

All fields are optional.

---

### Delete Media

```http
DELETE /media/:id?integrationId={integrationId}
```

**Response:**

```json
{ "success": true }
```

**Error (400):** Cannot delete media attached to a scheduled post.

---

## Bulk Operations

### Bulk Delete

```http
POST /media/bulk-delete?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**

```json
{ "success": true, "deleted": 3 }
```

---

### Bulk Move

```http
POST /media/bulk-move?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2"],
  "folderId": "uuid | null"
}
```

Set `folderId` to `null` to move to root.

---

### Bulk Tag

```http
POST /media/bulk-tag?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2"],
  "tagIds": ["tag-uuid1", "tag-uuid2"]
}
```

---

### Bulk Untag

```http
POST /media/bulk-untag?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "mediaIds": ["uuid1", "uuid2"],
  "tagIds": ["tag-uuid1"]
}
```

---

## Folders

### List Folders

```http
GET /media/folders?integrationId={integrationId}&parentId={parentId}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `parentId` | UUID / `root` / empty | Filter by parent. Use `root` or omit for root-level folders |

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Q1 Campaign",
    "parentId": null,
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  }
]
```

---

### Get Folder

```http
GET /media/folders/:id?integrationId={integrationId}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Q1 Campaign",
  "parentId": null,
  "parent": null,
  "children": [
    { "id": "uuid", "name": "Week 1", "parentId": "parent-uuid" }
  ],
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-10T10:00:00Z"
}
```

---

### Get Folder Breadcrumb Path

```http
GET /media/folders/:id/path?integrationId={integrationId}
```

**Response:**

```json
[
  { "id": "uuid1", "name": "Clients" },
  { "id": "uuid2", "name": "Acme Corp" },
  { "id": "uuid3", "name": "Q1" }
]
```

Useful for breadcrumb navigation.

---

### Create Folder

```http
POST /media/folders?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "name": "New Folder",
  "parentId": "uuid | undefined"
}
```

---

### Rename Folder

```http
PATCH /media/folders/:id?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Renamed Folder"
}
```

---

### Move Folder

```http
PATCH /media/folders/:id/move?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "parentId": "uuid | null"
}
```

Set `parentId` to `null` to move to root.

---

### Delete Folder

```http
DELETE /media/folders/:id?integrationId={integrationId}
```

**Behavior:**
- Media inside the folder is moved to root (not deleted)
- Child folders are cascade deleted
- Media in child folders is also moved to root

---

## Tags

### List Tags

```http
GET /media/tags?integrationId={integrationId}&search={search}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Filter tags by name (for autocomplete) |

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Evergreen",
    "color": "#10B981",
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  }
]
```

---

### Create Tag

```http
POST /media/tags?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "name": "New Tag",
  "color": "#FF5733"
}
```

Color is optional (hex format).

---

### Update Tag

```http
PATCH /media/tags/:id?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Updated Name",
  "color": "#3B82F6"
}
```

Both fields optional.

---

### Delete Tag

```http
DELETE /media/tags/:id?integrationId={integrationId}
```

Removes the tag from all media (junction table cascades).

---

### Attach Tags to Media

```http
POST /media/:id/tags?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "tagIds": ["uuid1", "uuid2"]
}
```

---

### Detach Tags from Media

```http
DELETE /media/:id/tags?integrationId={integrationId}
Content-Type: application/json
```

**Body:**

```json
{
  "tagIds": ["uuid1"]
}
```

---

## Frontend Integration Patterns

### Media Grid View

```typescript
// Fetch paginated media for grid
const fetchMedia = async (page: number, filters: MediaFilters) => {
  const params = new URLSearchParams({
    integrationId,
    limit: '50',
    offset: String(page * 50),
    sortBy: filters.sortBy || 'createdAt',
    order: 'desc',
  });

  if (filters.folderId) params.set('folderId', filters.folderId);
  if (filters.search) params.set('search', filters.search);
  if (filters.type) params.set('type', filters.type);
  if (filters.tagIds?.length) params.set('tagIds', filters.tagIds.join(','));
  if (filters.isFavorite) params.set('isFavorite', 'true');

  const res = await api.get(`/media?${params}`);
  return res.data;
};
```

### Media Picker Modal

```typescript
// Same API, just different UI. Use for post composer.
// Suggested: Add filter for "Recent" = sortBy=createdAt&order=desc&limit=20
const fetchRecentMedia = () =>
  api.get(`/media?integrationId=${id}&sortBy=createdAt&order=desc&limit=20`);
```

### Drag-and-Drop to Folder

```typescript
const moveToFolder = (mediaIds: string[], folderId: string | null) =>
  api.post(`/media/bulk-move?integrationId=${id}`, { mediaIds, folderId });
```

### Toggle Favorite

```typescript
const toggleFavorite = (mediaId: string, isFavorite: boolean) =>
  api.patch(`/media/${mediaId}?integrationId=${id}`, { isFavorite });
```

### Folder Tree Navigation

```typescript
// Get root folders
const rootFolders = await api.get(`/media/folders?integrationId=${id}&parentId=root`);

// Get children of a folder
const children = await api.get(`/media/folders?integrationId=${id}&parentId=${folderId}`);

// Get breadcrumb
const path = await api.get(`/media/folders/${folderId}/path?integrationId=${id}`);
```

### Tag Management

```typescript
// Create tag with color
await api.post(`/media/tags?integrationId=${id}`, {
  name: 'Campaign Q1',
  color: '#8B5CF6'
});

// Tag autocomplete
const tags = await api.get(`/media/tags?integrationId=${id}&search=${query}`);

// Bulk tag selected items
await api.post(`/media/bulk-tag?integrationId=${id}`, {
  mediaIds: selectedIds,
  tagIds: [tagId]
});
```

---

## UI Component Suggestions

### MediaGrid
- Display `thumbnailUrl` (falls back to `url` for videos without thumbnails)
- Show favorite icon overlay
- Show usage badge (`usageCount > 0`)
- Checkbox for multi-select

### MediaDetail Sidebar
- Full-size preview
- Edit filename, altText
- Tag chips with add/remove
- "Used in X posts" with expandable list
- Move to folder dropdown
- Delete button (disabled if `usageCount > 0` for scheduled)

### FolderTree
- Recursive component for nested folders
- Drag target for bulk move
- Right-click context menu (rename, delete)

### TagFilter
- Chips that toggle on/off
- Color dot indicator
- "Manage Tags" opens tag CRUD modal

---

## Error Handling

| Status | Meaning |
|--------|---------|
| 400 | Bad request (validation failed, cannot delete scheduled media) |
| 401 | Unauthorized (invalid token) |
| 403 | Forbidden (no org access) |
| 404 | Not found (media/folder/tag doesn't exist) |
| 409 | Conflict (duplicate tag name) |
