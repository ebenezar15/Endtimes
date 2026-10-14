import type { SVGProps } from 'react'

/** Hand-drawn 24×24 stroke icons. */
const PATHS = {
  omega: <path d="M5 20h4v-2.5a7 7 0 1 1 6 0V20h4" />,
  wheel: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" /></>),
  scroll: (<><path d="M7 4h11a2 2 0 0 1 0 4h-2v10a2 2 0 0 1-2 2H6a2 2 0 0 1 0-4h2V6a2 2 0 0 0-2-2" /><path d="M11 10h3M11 13h3" /></>),
  seal: (<><circle cx="12" cy="10" r="6" /><path d="M9 15.5L7.5 21l4.5-2.5 4.5 2.5-1.5-5.5" /><path d="M10 10l1.5 1.5L14 9" /></>),
  trumpet: <path d="M3 10v4h3l9 4V6L6 10H3zM15 9.5c2 .5 4 .5 6-.5v6c-2-1-4-1-6-.5" />,
  lamp: <path d="M12 3c1 2 2.5 3 2.5 5a2.5 2.5 0 0 1-5 0C9.5 6 11 5 12 3zM8 12h8M12 12v6M8 21h8M10 18h4" />,
  crown: <path d="M4 18h16M5 18l-1.5-9 5 4L12 6l3.5 7 5-4L19 18" />,
  fork: <path d="M12 21v-7l-6-6V3M12 14l6-6V3M4 5l2-2 2 2M16 5l2-2 2 2" />,
  layers: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  timeline: <path d="M3 12h18M7 8v8M12 5v14M17 9v6" />,
  book: (<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /><path d="M12 7v6M9.5 9.5h5" /></>),
  scales: <path d="M12 3v18M7 21h10M4 7h16M6.5 7L3.5 14a3 3 0 0 0 6 0zM17.5 7l-3 7a3 3 0 0 0 6 0z" />,
  library: <path d="M4 20V5M8 20V5M12 20l-2-15M15 20V7M19 20V7M3 20h18" />,
  quote: <path d="M5 17c0-4 1-8 5-10M14 17c0-4 1-8 5-10M5 17h4v-4H5zM14 17h4v-4h-4z" />,
  compass: (<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>),
  cap: <path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" />,
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  palette: (<><path d="M12 3a9 9 0 0 0 0 18c1.2 0 2-.8 2-2 0-.6-.3-1-.6-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.2-4-7.5-9-7.5z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>),
  contrast: (<><circle cx="12" cy="12" r="9" /><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" /></>),
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  play: <path d="M7 4l13 8-13 8z" />,
  pause: <path d="M7 4h3v16H7zM14 4h3v16h-3z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  sparkles: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  shuffle: <path d="M3 7h4c4 0 6 10 10 10h4M3 17h4c1.6 0 2.8-1.6 4-3.7M14 9.7c1-1.6 2-2.7 3-2.7h4M18 4l3 3-3 3M18 14l3 3-3 3" />,
  star: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z" />,
  question: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" /></>),
  hourglass: <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  motion: <path d="M4 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />,
  text: <path d="M4 7V5h16v2M12 5v14M9 19h6" />,
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 18, className, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...rest}>
      {PATHS[name]}
    </svg>
  )
}
