// components/icons/document-icon.tsx

import { SVGProps } from "react";

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 3h6l4 4v10a4 4 0 01-4 4H8a4 4 0 01-4-4V7a4 4 0 014-4zM14 3v4h4"
    />
  </svg>
);
