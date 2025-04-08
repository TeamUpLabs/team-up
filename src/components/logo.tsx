import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={`font-mono text-xl font-semibold ${className}`}>
      <Link href="/">
        <span className="text-green-400">&lt;</span>
        <span className="text-purple-400">TeamUp</span>
        <span className="text-green-400">/&gt;</span>
      </Link>
    </div>
  )
}