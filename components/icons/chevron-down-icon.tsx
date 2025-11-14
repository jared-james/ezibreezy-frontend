// components/icons/chevron-down-icon.tsx
import { SVGProps } from 'react';

interface ChevronDownIconProps extends SVGProps<SVGSVGElement> {
  isOpen?: boolean;
}

export function ChevronDownIcon({ isOpen, className, ...props }: ChevronDownIconProps) {
  return (
    <svg
      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${className || ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}