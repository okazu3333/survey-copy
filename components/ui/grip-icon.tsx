interface GripIconProps {
  size?: number;
  className?: string;
}

export const GripIcon = ({
  size = 21,
  className = "text-[#556064]",
}: GripIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="ドラッグハンドル"
    >
      <title>ドラッグハンドル</title>
      {/* 9点のグリッド型（3列×3行） */}
      <circle cx="6" cy="6" r="1" />
      <circle cx="12" cy="6" r="1" />
      <circle cx="18" cy="6" r="1" />
      <circle cx="6" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
      <circle cx="6" cy="18" r="1" />
      <circle cx="12" cy="18" r="1" />
      <circle cx="18" cy="18" r="1" />
    </svg>
  );
};
