// lib/types/onboarding.ts

/**
 * Backend Integration Types: User Onboarding Flow
 * These types must match the backend API exactly
 */

// Request: POST /users/sync
export interface SyncUserRequest {
  id: string;
  email: string;
  displayName?: string;
  inviteToken?: string;
}

// Response: POST /users/sync
export type SyncUserResponse =
  | { event: 'onboarding_required' }
  | {
      event: 'login' | 'invite_accepted';
      targetOrganizationId: string;
      targetWorkspaceId: string;
      targetWorkspaceSlug: string;
    };

// Request: POST /users/onboarding/complete
export interface CompleteOnboardingRequest {
  organizationName: string;
  workspaceName: string;
  timezone: string;
}

// Response: POST /users/onboarding/complete
export interface CompleteOnboardingResponse {
  event: 'onboarded' | 'login'; // 'login' returned if idempotency check catches existing org
  targetOrganizationId: string;
  targetWorkspaceId: string;
  targetWorkspaceSlug: string;
}
