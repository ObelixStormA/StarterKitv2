interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
}

/**
 * Logo Component
 * Displays the Adminex logo
 */
export function Logo({
  className = '',
  width = 125,
  height = 24,
  showText = true
}: LogoProps) {
  if (showText) {
    return (
      <img
        src="/assets/logo/logo.svg"
        alt="Adminex"
        className={className}
        style={{ width, height }}
      />
    )
  }

  // Icon only version - use logomark.svg
  return (
    <img
      src="/assets/logo/logomark.svg"
      alt="Adminex"
      className={className}
      style={{ width: height, height }}
    />
  )
}
