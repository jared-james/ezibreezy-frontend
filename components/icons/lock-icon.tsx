// components/icons/lock-icon.tsx
import { SVGProps } from 'react';

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 10V8a5 5 0 0 1 10 0v2"
      />
      <rect
        x="4.75"
        y="10"
        width="14.5"
        height="9.5"
        rx="2.5"
        strokeWidth="1.6"
      />
    </svg>
  );
}