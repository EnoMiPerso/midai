export default function MidaiLogo({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="MIDAI logo"
    >
      {/* Outer spark diamond */}
      <path
        d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
        fill="#FF5500"
        opacity="0.15"
      />
      {/* Inner core spark */}
      <path
        d="M12 5 L13.4 10.6 L19 12 L13.4 13.4 L12 19 L10.6 13.4 L5 12 L10.6 10.6 Z"
        fill="#FF5500"
      />
      {/* Accent dot — top-right spark tip */}
      <circle cx="19.5" cy="4.5" r="1.2" fill="#FF5500" opacity="0.55" />
      {/* Small line accent */}
      <line x1="17" y1="3" x2="19" y2="5" stroke="#FF5500" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    </svg>
  )
}
