// components/icons/gift-icon.tsx
import { SVGProps } from 'react';

export function GiftIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7M3 8h18M12 8v13"
      />
      <path
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8H8.5A2.5 2.5 0 1 1 11 5.5L12 8Zm0 0h3.5a2.5 2.5 0 1 0-2.5-2.5L12 8Z"
      />
    </svg>
  );
}