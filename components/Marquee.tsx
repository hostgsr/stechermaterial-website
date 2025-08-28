import React from 'react'

interface MarqueeProps {
  text: string
  className?: string
  speed?: number
  pauseOnHover?: boolean
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  className = '',
  speed = 20,
  pauseOnHover = true,
}) => {
  return (
    <div className={`marquee-container ${className}`}>
      <div className="marquee-content" style={{animationDuration: `${speed}s`}}>
        <span className="marquee-text">
          {text} • {text} • {text}
        </span>
      </div>
    </div>
  )
}

export default Marquee
