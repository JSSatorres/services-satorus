export function BrandLogo() {
  return (
    <span className="brand-logo" aria-hidden="true">
      <svg className="brand-mark" viewBox="0 0 48 48" focusable="false">
        <path
          d="M36.5 10.8C30.2 5.8 18.1 5.7 11.8 12.4C5.7 18.9 11.8 23.9 24 23.9C36.5 23.9 42.3 29 36.2 35.8C30.4 42.2 18 42.4 10.7 36.7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="6.5"
        />
        <circle className="brand-mark-terminal" cx="10.7" cy="36.7" r="4.2" />
      </svg>
      <span className="wordmark-text">satorus.</span>
    </span>
  );
}
