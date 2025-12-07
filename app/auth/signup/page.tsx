// app/auth/signup/page.tsx

import { Suspense } from "react";
import ComingSoonSignUp from "@/components/sign-up/coming-soon-sign-up";
import FullSignUp from "@/components/sign-up/full-sign-up";

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
