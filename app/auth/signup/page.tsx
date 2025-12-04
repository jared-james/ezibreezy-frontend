// app/auth/signup/page.tsx

"use client";

import { Suspense } from "react";
import ComingSoonSignUp from "./ComingSoonSignUp";
import FullSignUp from "./FullSignUp";

export default function SignUp() {
  const isProdDomain =
    typeof window !== "undefined" &&
    (window.location.hostname === "www.ezibreezy.com" ||
      window.location.hostname === "ezibreezy.com");

  if (isProdDomain) {
    return <ComingSoonSignUp />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FullSignUp />
    </Suspense>
  );
}
