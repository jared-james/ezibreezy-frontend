// components/icons/flame-icon.tsx
import { SVGProps } from "react";

export function FlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.364 5.126A9.9 9.9 0 0112 3C9.113 3 6.61 4.556 5.64 6.912A9.923 9.923 0 0012 21a9.923 9.923 0 006.36-14.088z"
      />
    </svg>
  );
}
