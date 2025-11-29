# PostHog Integration Status

## ✅ Completed Steps

### 1. Environment Configuration
- Added PostHog environment variables to `.env`:
  - `NEXT_PUBLIC_POSTHOG_KEY=phc_HtmIGoqMBGdXJYIB6Y4UvScPcddDstoS9webZyaOwKg`
  - `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`

### 2. PostHog Setup Files Created
- ✅ `instrumentation-client.ts` - Client-side PostHog initialization
- ✅ `lib/posthog-server.ts` - Server-side PostHog client

### 3. Event Tracking Plan Created
- ✅ `.posthog-events.json` - Contains 14 events mapped to specific files

### 4. Events Implemented

#### ✅ Authentication Events
- **File**: `app/auth/signup/FullSignUp.tsx`
  - ✅ `user_signed_up` - Tracks successful user signup
  - ✅ `auth_error_occurred` - Tracks signup errors
  - ✅ User identification on signup with email

- **File**: `app/auth/login/page.tsx`
  - ✅ `user_logged_in` - Tracks successful login
  - ✅ `auth_error_occurred` - Tracks login errors
  - ✅ User identification on login with email

#### ✅ Onboarding Events
- **File**: `app/(app)/onboarding/page.tsx`
  - ✅ `onboarding_completed` - Tracks completion of onboarding flow

#### ✅ Integration Events
- **File**: `app/(app)/settings/integrations/page.tsx`
  - ✅ `social_account_connected` - Tracks successful social media account connections
  - ✅ `social_account_disconnected` - Tracks account disconnections
  - ✅ `integration_connection_failed` - Tracks connection failures

## 🚧 Pending Installation

### Required: Install PostHog Packages
Run the following command to install PostHog dependencies:

```bash
pnpm add posthog-js posthog-node
```

## 📋 Events Still To Implement

The following events from `.posthog-events.json` still need to be implemented:

1. **`post_created`** - `app/(app)/calendar/components/editorial-modal.tsx`
2. **`post_rescheduled`** - `app/(app)/calendar/page.tsx`
3. **`ai_briefing_generated`** - `app/(app)/ideas/components/ai-briefing.tsx`
4. **`idea_clipping_saved`** - `app/(app)/ideas/components/new-clipping.tsx`
5. **`media_uploaded`** - `app/(app)/assets/media/page.tsx`
6. **`marketing_tool_used`** - `app/(marketing)/tools/instagram-carousel-splitter/page.tsx`
7. **`user_synced`** - `app/actions/user.ts`

## 🎯 Next Steps

### 1. Install Dependencies (REQUIRED)
```bash
pnpm add posthog-js posthog-node
```

### 2. Optional: Add Reverse Proxy for Better Tracking
Add to `next.config.js` or `next.config.ts`:

```typescript
async rewrites() {
  return [
    {
      source: "/ingest/static/:path*",
      destination: "https://us-assets.i.posthog.com/static/:path*",
    },
    {
      source: "/ingest/:path*",
      destination: "https://us.i.posthog.com/:path*",
    },
  ];
}
```

Then update `instrumentation-client.ts`:
```typescript
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",  // Changed from NEXT_PUBLIC_POSTHOG_HOST
  ui_host: "https://us.posthog.com",
  // ... rest of config
});
```

### 3. Implement Remaining Events
Continue adding PostHog tracking to the files listed above in "Events Still To Implement"

### 4. Add Logout Tracking
In your logout handler, add:
```typescript
posthog.capture('user_logged_out');
posthog.reset(); // Clear user identification
```

## 📊 Event Properties Reference

### User Identification
Users are identified by their email address:
```typescript
posthog.identify(email, {
  email: email,
});
```

### Common Event Properties
- **email**: User's email address
- **platform**: Social media platform (instagram, facebook, etc.)
- **error_type**: Type of error (login, signup, integration_connection, etc.)
- **error_message**: Error message text

## 🔍 Testing

Once packages are installed, test the integration by:

1. **Start the dev server**: `pnpm dev`
2. **Sign up for a new account** - Should track `user_signed_up`
3. **Log in** - Should track `user_logged_in`
4. **Complete onboarding** - Should track `onboarding_completed`
5. **Connect/disconnect a social account** - Should track connection events

Check PostHog dashboard at: https://us.posthog.com

## 📚 Resources

- [PostHog Next.js Documentation](https://posthog.com/docs/libraries/next-js)
- [PostHog React SDK](https://posthog.com/docs/libraries/react)
- [PostHog Node SDK](https://posthog.com/docs/libraries/node)
