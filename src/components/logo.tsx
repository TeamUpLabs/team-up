interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`font-mono text-xl font-semibold ${className}`}>
      <span className="text-green-400">&lt;</span>
      <span className="text-purple-400">TeamUp</span>
      <span className="text-green-400">/&gt;</span>
    </div>
  )
}

export function MiniLogo({ className }: LogoProps) {
  return (
    <div className={`font-mono text-xl font-semibold ${className}`}>
      <span className="text-green-400">&lt;</span>
      <span className="text-green-400">/&gt;</span>
    </div>
  )
}