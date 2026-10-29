const PATHS = {
  home: (<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>),
  gym: (<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12" />),
  ball: (<><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>),
  court: (<><rect x="3" y="6" width="18" height="12" rx="1.5" /><path d="M12 6v12" /><circle cx="12" cy="12" r="2.5" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  list: (<><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h6" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>),
  arrow: (<path d="M5 12h14M13 6l6 6-6 6" />),
  check: (<path d="M5 12l5 5 9-10" />)
}

export default function Icon({ name, size = 20, className = '', ...rest }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}