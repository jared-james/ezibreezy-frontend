// lib/constants/reserved-slugs.ts

/**
 * Reserved Slugs System
 *
 * These slugs are protected and cannot be used as workspace slugs to prevent
 * routing conflicts when migrating to path-based routing (/:workspace/...)
 *
 * CRITICAL: When adding new top-level routes to the app, add them here!
 */

/**
 * List of reserved slugs that cannot be used for workspace identifiers.
 *
 * Categories:
 * - Authentication & User: Routes for login, signup, account management
 * - System Routes: API, static files, Next.js internals
 * - App Features: Top-level feature routes that exist outside workspace context
 * - Settings: User-level settings (workspace settings will be /:workspace/settings)
 * - Legal & Marketing: Public pages
 */
export const RESERVED_SLUGS = [
  // Authentication & User
  'auth',
  'login',
  'signup',
  'register',
  'logout',
  'account',          // User-level account settings (/:workspace/settings for workspace)
  'profile',
  'join',            // Invite acceptance flow
  'invite',
  'verify',
  'reset',
  'forgot',
  'password',

  // Onboarding
  'onboarding',
  'welcome',
  'getting-started',
  'setup',

  // System Routes
  'api',
  '_next',
  'static',
  'public',
  'assets',         // Careful: your app has /assets/media, but in new structure it will be /:workspace/assets
  'files',
  'uploads',
  'images',

  // Admin & System Management
  'admin',
  'system',
  'console',
  'superadmin',
  'root',

  // Legal & Marketing (public pages)
  'about',
  'pricing',
  'contact',
  'blog',
  'docs',
  'help',
  'support',
  'privacy',
  'terms',
  'tos',
  'legal',
  'security',
  'careers',
  'jobs',
  'tools',          // Your free tools section

  // Settings (top-level - user settings)
  'settings',       // Reserved for user settings; workspace settings at /:workspace/settings
  'preferences',
  'notifications',
  'billing',        // User billing; org billing might be /:workspace/settings/billing

  // Reserved for future features
  'dashboard',      // Could be a user-level dashboard showing all workspaces
  'marketplace',
  'integrations',   // Top-level integrations discovery
  'templates',
  'explore',

  // Common subdomains/paths to avoid
  'www',
  'app',
  'mail',
  'cdn',
  'media',

  // Prevent common exploits
  'null',
  'undefined',
  'admin',
  'test',
  'demo',
  'example',
  'default',

  // HTTP methods (edge case protection)
  'get',
  'post',
  'put',
  'patch',
  'delete',

  // Single character slugs (reserve for future short URLs)
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
] as const;

/**
 * Validation function to check if a slug is reserved.
 * Case-insensitive comparison to prevent bypassing with capitalization.
 */
export function isReservedSlug(slug: string): boolean {
  const normalized = slug.toLowerCase().trim();
  return (RESERVED_SLUGS as readonly string[]).includes(normalized);
}

/**
 * Validates a workspace slug for creation/update.
 * Returns an object with validation result and error message if invalid.
 */
export interface SlugValidationResult {
  valid: boolean;
  error?: string;
}

export function validateWorkspaceSlug(slug: string): SlugValidationResult {
  // Empty check
  if (!slug || slug.trim().length === 0) {
    return {
      valid: false,
      error: 'Slug cannot be empty',
    };
  }

  const normalized = slug.toLowerCase().trim();

  // Length validation
  if (normalized.length < 3) {
    return {
      valid: false,
      error: 'Slug must be at least 3 characters long',
    };
  }

  if (normalized.length > 63) {
    return {
      valid: false,
      error: 'Slug must be 63 characters or less',
    };
  }

  // Format validation (alphanumeric and hyphens only)
  // Must start with letter, end with letter or number
  const slugRegex = /^[a-z][a-z0-9-]*[a-z0-9]$/;
  if (!slugRegex.test(normalized)) {
    return {
      valid: false,
      error: 'Slug must start with a letter, contain only lowercase letters, numbers, and hyphens, and cannot end with a hyphen',
    };
  }

  // No consecutive hyphens
  if (normalized.includes('--')) {
    return {
      valid: false,
      error: 'Slug cannot contain consecutive hyphens',
    };
  }

  // Reserved slug check
  if (isReservedSlug(normalized)) {
    return {
      valid: false,
      error: `"${slug}" is a reserved keyword and cannot be used as a workspace slug`,
    };
  }

  return { valid: true };
}

/**
 * Get a user-friendly list of example reserved slugs for error messages
 */
export function getReservedSlugExamples(): string[] {
  return ['admin', 'api', 'auth', 'settings', 'account', 'login'];
}
