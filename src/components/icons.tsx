import { cn } from "@/lib/utils"
import React from "react"

export const IconPython = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-6 w-6", className)}
    {...props}
  >
    <path d="M13.83 11.17c-2.33-2.33-2.33-6.14 0-8.47 2.33-2.33 6.14-2.33 8.47 0" />
    <path d="M10.17 12.83c2.33 2.33 2.33 6.14 0 8.47-2.33 2.33-6.14 2.33-8.47 0" />
    <path d="M12 12v12" />
    <path d="M12 12H0" />
    <path d="M12 12c4.67 0 8.5-3.83 8.5-8.5v0" />
    <path d="M12 12c-4.67 0-8.5 3.83-8.5 8.5v0" />
  </svg>
)

export const IconSQL = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-6 w-6", className)}
    {...props}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

export const IconReact = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-6 w-6", className)}
    {...props}
  >
    <circle cx="12" cy="12" r="2" />
    <g>
      <ellipse cx="12" cy="12" rx="11" ry="4" />
      <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)" />
    </g>
  </svg>
)
