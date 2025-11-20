// app/auth/signup/page.tsx

"use client";

import ComingSoonSignUp from "./ComingSoonSignUp";
import FullSignUp from "./FullSignUp";

// Main component that decides which version to render
export default function SignUp() {
  const isProdDomain =
    typeof window !== "undefined" &&
    (window.location.hostname === "www.ezibreezy.com" ||
      window.location.hostname === "ezibreezy.com");

  if (isProdDomain) {
    return <ComingSoonSignUp />;
  }

  return <FullSignUp />;
}
