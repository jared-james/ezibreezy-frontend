// app/auth/signup/page.tsx

import { Suspense } from "react";
import ComingSoonSignUp from "./ComingSoonSignUp";
import FullSignUp from "./FullSignUp";

// Control signup mode via environment variable instead of window check
// This prevents hydration mismatches between server and client
const ENABLE_WAITLIST_MODE = process.env.NEXT_PUBLIC_ENABLE_WAITLIST === "true";

export default function SignUp() {
  if (ENABLE_WAITLIST_MODE) {
    return <ComingSoonSignUp />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FullSignUp />
    </Suspense>
  );
}
