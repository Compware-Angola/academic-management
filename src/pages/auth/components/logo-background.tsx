type LogoBackgroundProps = {
  top?: string
  right?: string
  bottom?: string
  left?: string
  size?: string
  opacity?: number
}

export function LogoBackground(props: LogoBackgroundProps) {
  const { top, right, bottom, left, size = '8rem', opacity = 0.05 } = props

  return (
    <div
      className="absolute "
      style={{
        top,
        right,
        bottom,
        left,
        width: size,
        height: size,
        opacity,
        backgroundImage: `url(/logo_bg.png)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
