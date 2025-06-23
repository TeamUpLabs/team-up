import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export type BadgeColor = "gray" | "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "pink" | "zinc" | "teal" | "stone" | "neutral" | "emerald" | "violet" | "cyan" | "black" | "white" | "none";

interface BadgeProps {
  content: string | React.ReactNode;
  color: BadgeColor;
  isEditable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  isDark?: boolean;
  className?: string;
}

export default function Badge({ content, color, isEditable = false, onRemove, onClick, isDark = false, className }: BadgeProps) {

  const badgeColors = {
    gray: "bg-gray-100 text-gray-800 border border-gray-300",
    red: "bg-red-100 text-red-800 border border-red-300",
    green: "bg-green-100 text-green-800 border border-green-300",
    blue: "bg-blue-100 text-blue-800 border border-blue-300",
    yellow: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    purple: "bg-purple-100 text-purple-800 border border-purple-300",
    orange: "bg-orange-100 text-orange-800 border border-orange-300",
    pink: "bg-pink-100 text-pink-800 border border-pink-300",
    zinc: "bg-zinc-100 text-zinc-800 border border-zinc-300",
    teal: "bg-teal-100 text-teal-800 border border-teal-300",
    stone: "bg-stone-100 text-stone-800 border border-stone-300",
    neutral: "bg-neutral-100 text-neutral-800 border border-neutral-300",
    emerald: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    violet: "bg-violet-100 text-violet-800 border border-violet-300",
    cyan: "bg-cyan-100 text-cyan-800 border border-cyan-300",
    black: "bg-black text-white border border-white",
    white: "bg-white text-black border border-black",
    none: "bg-transparent text-text-primary border border-component-border"
  };

  const darkBadgeColors = {
    gray: "bg-gray-800/20 text-gray-500 border border-gray-800",
    red: "bg-red-800/20 text-red-500 border border-red-800",
    green: "bg-green-800/20 text-green-500 border border-green-800",
    blue: "bg-blue-800/20 text-blue-500 border border-blue-800",
    yellow: "bg-yellow-800/20 text-yellow-500 border border-yellow-800",
    purple: "bg-purple-800/20 text-purple-500 border border-purple-800",
    orange: "bg-orange-800/20 text-orange-500 border border-orange-800",
    pink: "bg-pink-800/20 text-pink-500 border border-pink-800",
    zinc: "bg-zinc-800/20 text-zinc-500 border border-zinc-800",
    teal: "bg-teal-800/20 text-teal-500 border border-teal-800",
    stone: "bg-stone-800/20 text-stone-500 border border-stone-800",
    neutral: "bg-neutral-800/20 text-neutral-500 border border-neutral-800",
    emerald: "bg-emerald-800/20 text-emerald-500 border border-emerald-800",
    violet: "bg-violet-800/20 text-violet-500 border border-violet-800",
    cyan: "bg-cyan-800/20 text-cyan-500 border border-cyan-800",
    black: "bg-black/20 text-white border border-white",
    white: "bg-white/20 text-white border border-black",
    none: "bg-transparent text-text-primary border border-component-border"
  };

  const badgeXmarkColors = {
    gray: "text-gray-800 hover:text-gray-600",
    red: "text-red-800 hover:text-red-600",
    green: "text-green-800 hover:text-green-600",
    blue: "text-blue-800 hover:text-blue-600",
    yellow: "text-yellow-800 hover:text-yellow-600",
    purple: "text-purple-800 hover:text-purple-600",
    orange: "text-orange-800 hover:text-orange-600",
    pink: "text-pink-800 hover:text-pink-600",
    zinc: "text-zinc-800 hover:text-zinc-600",
    teal: "text-teal-800 hover:text-teal-600",
    stone: "text-stone-800 hover:text-stone-600",
    neutral: "text-neutral-800 hover:text-neutral-600",
    emerald: "text-emerald-800 hover:text-emerald-600",
    violet: "text-violet-800 hover:text-violet-600",
    cyan: "text-cyan-800 hover:text-cyan-600",
    black: "text-white hover:text-white",
    white: "text-black hover:text-black",
    none: "text-text-primary"
  };

  const darkBadgeXmarkColors = {
    gray: "text-gray-500 hover:text-gray-400",
    red: "text-red-500 hover:text-red-400",
    green: "text-green-500 hover:text-green-400",
    blue: "text-blue-500 hover:text-blue-400",
    yellow: "text-yellow-500 hover:text-yellow-400",
    purple: "text-purple-500 hover:text-purple-400",
    orange: "text-orange-500 hover:text-orange-400",
    pink: "text-pink-500 hover:text-pink-400",
    zinc: "text-zinc-500 hover:text-zinc-400",
    teal: "text-teal-500 hover:text-teal-400",
    stone: "text-stone-500 hover:text-stone-400",
    neutral: "text-neutral-500 hover:text-neutral-400",
    emerald: "text-emerald-500 hover:text-emerald-400",
    violet: "text-violet-500 hover:text-violet-400",
    cyan: "text-cyan-500 hover:text-cyan-400",
    black: "text-white hover:text-white",
    white: "text-black hover:text-black",
    none: "text-text-primary"
  };

  return (
    <span className={`${isDark ? darkBadgeColors[color] : badgeColors[color]} px-3 py-1 rounded-md text-sm ${className}`} onClick={onClick}>
      {content}
      {isEditable && (
        <button
          className={`${isDark ? darkBadgeXmarkColors[color] : badgeXmarkColors[color]} ml-2 focus:outline-none cursor-pointer`}
          onClick={onRemove}
          type="button"
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
      )}
    </span>
  );
}