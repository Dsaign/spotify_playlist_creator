export default function Logo({ className }: { className?: string }) {
  return (
    <svg width="180" height="36" viewBox="0 0 180 36" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>timbre</title>
      <circle cx="18" cy="18" r="18" fill="#7C6EFA" />
      <text
        x="11"
        y="25"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontWeight="400"
        className="fill-white"
      >
        t
      </text>
      <text
        x="46"
        y="25"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontWeight="300"
        letterSpacing="4"
        fill="currentColor"
      >
        timbre
      </text>
    </svg>
  );
}
