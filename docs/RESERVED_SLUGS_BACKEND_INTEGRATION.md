# Reserved Slugs System - Backend Integration Guide

## Overview

This document outlines the **critical** implementation requirements for the backend to prevent workspace slug conflicts when migrating to path-based routing (`/:workspace/...`).

## The Problem

When using path-based routing like `https://app.ezibreezy.com/:workspace/calendar`, there's a collision risk if a workspace slug matches a top-level route:

- ❌ User creates workspace "api" → `app.com/api` conflicts with API routes
- ❌ User creates workspace "admin" → `app.com/admin` conflicts with admin panel
- ❌ User creates workspace "account" → `app.com/account` conflicts with user settings

## Frontend Implementation Status

✅ **COMPLETED** - Frontend now validates workspace names before creation/update:
- File: `lib/constants/reserved-slugs.ts`
- Validation happens in workspace creation modal and update form
- Prevents users from submitting names that would generate reserved slugs

## Backend Requirements

### 1. Create Reserved Slugs Constant

Add this to your NestJS backend (e.g., `src/workspaces/constants/reserved-slugs.constant.ts`):

```typescript
/**
 * Reserved workspace slugs that cannot be used due to routing conflicts.
 * Must stay in sync with frontend: lib/constants/reserved-slugs.ts
 */
export const RESERVED_WORKSPACE_SLUGS = [
  // Authentication & User
  'auth', 'login', 'signup', 'register', 'logout', 'account', 'profile',
  'join', 'invite', 'verify', 'reset', 'forgot', 'password',

  // Onboarding
  'onboarding', 'welcome', 'getting-started', 'setup',

  // System Routes
  'api', '_next', 'static', 'public', 'assets', 'files', 'uploads', 'images',

  // Admin & System
  'admin', 'system', 'console', 'superadmin', 'root',

  // Legal & Marketing
  'about', 'pricing', 'contact', 'blog', 'docs', 'help', 'support',
  'privacy', 'terms', 'tos', 'legal', 'security', 'careers', 'jobs', 'tools',

  // Settings
  'settings', 'preferences', 'notifications', 'billing',

  // Future Features
  'dashboard', 'marketplace', 'integrations', 'templates', 'explore',

  // Common paths
  'www', 'app', 'mail', 'cdn', 'media',

  // Security
  'null', 'undefined', 'test', 'demo', 'example', 'default',

  // HTTP methods
  'get', 'post', 'put', 'patch', 'delete',

  // Single characters (reserved for future short URLs)
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
] as const;

export function isReservedSlug(slug: string): boolean {
  return RESERVED_WORKSPACE_SLUGS.includes(slug.toLowerCase().trim() as any);
}
```

### 2. Update Workspace DTO Validation

Add validation to your `CreateWorkspaceDto` and `UpdateWorkspaceDto`:

```typescript
// src/workspaces/dto/create-workspace.dto.ts

import { IsNotEmpty, IsString, MaxLength, Matches, Validate } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { isReservedSlug } from '../constants/reserved-slugs.constant';

@ValidatorConstraint({ name: 'isNotReservedSlug', async: false })
export class IsNotReservedSlugConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (!name) return true; // Let @IsNotEmpty handle empty values

    // Generate slug from name (same logic as your slugify function)
    const potentialSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return !isReservedSlug(potentialSlug);
  }

  defaultMessage(args: ValidationArguments) {
    const name = args.value;
    const potentialSlug = name
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^a-z0-9]+/g, '-')
      ?.replace(/^-+|-+$/g, '');

    return `Workspace name "${name}" would generate reserved URL slug "${potentialSlug}". Please choose a different name.`;
  }
}

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Validate(IsNotReservedSlugConstraint)
  name: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  timezone: string;
}
```

### 3. Add Database-Level Check (Defense in Depth)

In your `WorkspacesService.create()` and `WorkspacesService.update()` methods, add an additional check:

```typescript
// src/workspaces/workspaces.service.ts

import { BadRequestException } from '@nestjs/common';
import { isReservedSlug } from './constants/reserved-slugs.constant';

export class WorkspacesService {
  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    // Generate slug from name
    const slug = this.generateSlug(createWorkspaceDto.name);

    // CRITICAL: Check if slug is reserved
    if (isReservedSlug(slug)) {
      throw new BadRequestException(
        `Workspace name "${createWorkspaceDto.name}" generates a reserved URL slug "${slug}". ` +
        `Reserved slugs include: admin, api, auth, settings, account, and others. ` +
        `Please choose a different name.`
      );
    }

    // Check if slug already exists (existing uniqueness check)
    const existing = await this.prisma.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException(`Workspace with slug "${slug}" already exists`);
    }

    // Proceed with creation...
    return this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        slug,
        timezone: createWorkspaceDto.timezone,
        organizationId: createWorkspaceDto.organizationId,
        // ...other fields
      },
    });
  }

  async update(workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    // If name is being updated, check the new slug
    if (updateWorkspaceDto.name) {
      const newSlug = this.generateSlug(updateWorkspaceDto.name);

      // Check if new slug is reserved
      if (isReservedSlug(newSlug)) {
        throw new BadRequestException(
          `Workspace name "${updateWorkspaceDto.name}" generates a reserved URL slug "${newSlug}". ` +
          `Please choose a different name.`
        );
      }

      // Check if new slug conflicts with existing workspace (skip if it's the same workspace)
      const existing = await this.prisma.workspace.findUnique({
        where: { slug: newSlug },
      });

      if (existing && existing.id !== workspaceId) {
        throw new BadRequestException(`Workspace with slug "${newSlug}" already exists`);
      }
    }

    // Proceed with update...
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
```

### 4. Migration Script for Existing Workspaces

If you have existing workspaces with reserved slugs, create a migration:

```typescript
// prisma/migrations/fix-reserved-slugs.ts

import { PrismaClient } from '@prisma/client';
import { RESERVED_WORKSPACE_SLUGS } from '../src/workspaces/constants/reserved-slugs.constant';

const prisma = new PrismaClient();

async function main() {
  const workspaces = await prisma.workspace.findMany();

  for (const workspace of workspaces) {
    if (RESERVED_WORKSPACE_SLUGS.includes(workspace.slug.toLowerCase())) {
      const newSlug = `${workspace.slug}-workspace`;
      console.log(`Renaming workspace "${workspace.slug}" to "${newSlug}"`);

      await prisma.workspace.update({
        where: { id: workspace.id },
        data: { slug: newSlug },
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Testing Checklist

### Backend Tests to Add:

- [ ] **Unit test**: `isReservedSlug()` returns true for all reserved slugs
- [ ] **Integration test**: Creating workspace with reserved name (e.g., "Admin") throws BadRequestException
- [ ] **Integration test**: Updating workspace to reserved name throws error
- [ ] **Integration test**: Creating workspace with allowed name succeeds
- [ ] **E2E test**: API endpoint `/workspaces` rejects reserved slugs with 400 status

### Example Test:

```typescript
// src/workspaces/workspaces.service.spec.ts

describe('WorkspacesService', () => {
  describe('create', () => {
    it('should throw BadRequestException for reserved slug "admin"', async () => {
      const dto: CreateWorkspaceDto = {
        name: 'Admin',  // Will generate slug "admin"
        organizationId: 'org-123',
        timezone: 'UTC',
      };

      await expect(service.create(dto, 'user-123')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException for reserved slug "api"', async () => {
      const dto: CreateWorkspaceDto = {
        name: 'API Team',  // Will generate slug "api-team" (allowed)
        organizationId: 'org-123',
        timezone: 'UTC',
      };

      // This should succeed
      await expect(service.create(dto, 'user-123')).resolves.toBeDefined();
    });

    it('should allow workspace name that does not generate reserved slug', async () => {
      const dto: CreateWorkspaceDto = {
        name: 'Marketing Team 2024',
        organizationId: 'org-123',
        timezone: 'UTC',
      };

      await expect(service.create(dto, 'user-123')).resolves.toBeDefined();
    });
  });
});
```

## API Response Examples

### ❌ Rejected (Reserved Slug):

```bash
POST /workspaces
{
  "name": "Admin",
  "organizationId": "123",
  "timezone": "UTC"
}

# Response: 400 Bad Request
{
  "statusCode": 400,
  "message": "Workspace name \"Admin\" generates a reserved URL slug \"admin\". Reserved slugs include: admin, api, auth, settings, account, and others. Please choose a different name.",
  "error": "Bad Request"
}
```

### ✅ Accepted (Valid Name):

```bash
POST /workspaces
{
  "name": "Marketing Team",
  "organizationId": "123",
  "timezone": "UTC"
}

# Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Marketing Team",
  "slug": "marketing-team",
  "organizationId": "123",
  "timezone": "UTC",
  "createdAt": "2025-12-06T10:00:00Z"
}
```

## Synchronization Requirements

### 🚨 CRITICAL: Keep Frontend and Backend in Sync

Whenever you add a new top-level route to the Next.js app, you MUST:

1. Add the route slug to `lib/constants/reserved-slugs.ts` (frontend)
2. Add the same slug to `src/workspaces/constants/reserved-slugs.constant.ts` (backend)
3. Notify the team via PR description or Slack

### Example:

```
Adding new route: /partnerships/...

Frontend: Add 'partnerships' to RESERVED_SLUGS array
Backend: Add 'partnerships' to RESERVED_WORKSPACE_SLUGS array
```

## Implementation Priority

1. **HIGH PRIORITY** (before path-based routing goes live):
   - [ ] Add reserved slugs constant to backend
   - [ ] Add validation to WorkspacesService
   - [ ] Add DTO validation
   - [ ] Run migration script for existing workspaces

2. **MEDIUM PRIORITY** (recommended):
   - [ ] Add comprehensive tests
   - [ ] Add API documentation

3. **LOW PRIORITY** (nice to have):
   - [ ] Add admin UI to view/manage reserved slugs
   - [ ] Add telemetry to track rejected workspace names

## Questions?

Contact the frontend team or refer to:
- Frontend implementation: `lib/constants/reserved-slugs.ts`
- This document: `docs/RESERVED_SLUGS_BACKEND_INTEGRATION.md`

---

**Last Updated**: 2025-12-06
**Frontend Version**: Implemented in migration to path-based routing
**Backend Version**: Pending implementation
