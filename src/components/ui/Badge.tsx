"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "@/contexts/ThemeContext";

export type BadgeColor = 
  | "red" | "orange" | "amber" | "yellow" | "lime" | "green" 
  | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" 
  | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "slate" 
  | "gray" | "zinc" | "neutral" | "stone" | "white" | "black" | "none";

export const badgeColors = {
  red: "!bg-red-100 !text-red-800 !border !border-red-300",
  orange: "!bg-orange-100 !text-orange-800 !border !border-orange-300",
  amber: "!bg-amber-100 !text-amber-800 !border !border-amber-300",
  yellow: "!bg-yellow-100 !text-yellow-800 !border !border-yellow-300",
  lime: "!bg-lime-100 !text-lime-800 !border !border-lime-300",
  green: "!bg-green-100 !text-green-800 !border !border-green-300",
  emerald: "!bg-emerald-100 !text-emerald-800 !border !border-emerald-300",
  teal: "!bg-teal-100 !text-teal-800 !border !border-teal-300",
  cyan: "!bg-cyan-100 !text-cyan-800 !border !border-cyan-300",
  sky: "!bg-sky-100 !text-sky-800 !border !border-sky-300",
  blue: "!bg-blue-100 !text-blue-800 !border !border-blue-300",
  indigo: "!bg-indigo-100 !text-indigo-800 !border !border-indigo-300",
  violet: "!bg-violet-100 !text-violet-800 !border !border-violet-300",
  purple: "!bg-purple-100 !text-purple-800 !border !border-purple-300",
  fuchsia: "!bg-fuchsia-100 !text-fuchsia-800 !border !border-fuchsia-300",
  pink: "!bg-pink-100 !text-pink-800 !border !border-pink-300",
  rose: "!bg-rose-100 !text-rose-800 !border !border-rose-300",
  slate: "!bg-slate-100 !text-slate-800 !border !border-slate-300",
  gray: "!bg-gray-100 !text-gray-800 !border !border-gray-300",
  zinc: "!bg-zinc-100 !text-zinc-800 !border !border-zinc-300",
  neutral: "!bg-neutral-100 !text-neutral-800 !border !border-neutral-300",
  stone: "!bg-stone-100 !text-stone-800 !border !border-stone-300",
  black: "!bg-black !text-white !border !border-white",
  white: "!bg-white !text-black !border !border-black",
  none: "!bg-transparent !text-text-primary !border !border-component-border"
};

export const darkBadgeColors = {
  red: "!bg-red-800/20 !text-red-500 !border !border-red-800",
  orange: "!bg-orange-800/20 !text-orange-500 !border !border-orange-800",
  amber: "!bg-amber-800/20 !text-amber-500 !border !border-amber-800",  
  yellow: "!bg-yellow-800/20 !text-yellow-500 !border !border-yellow-800",
  lime: "!bg-lime-800/20 !text-lime-500 !border !border-lime-800",
  green: "!bg-green-800/20 !text-green-500 !border !border-green-800",
  emerald: "!bg-emerald-800/20 !text-emerald-500 !border !border-emerald-800",
  teal: "!bg-teal-800/20 !text-teal-500 !border !border-teal-800",
  cyan: "!bg-cyan-800/20 !text-cyan-500 !border !border-cyan-800",
  sky: "!bg-sky-800/20 !text-sky-500 !border !border-sky-800",
  blue: "!bg-blue-800/20 !text-blue-500 !border !border-blue-800",
  indigo: "!bg-indigo-800/20 !text-indigo-500 !border !border-indigo-800",
  violet: "!bg-violet-800/20 !text-violet-500 !border !border-violet-800",
  purple: "!bg-purple-800/20 !text-purple-500 !border !border-purple-800",
  fuchsia: "!bg-fuchsia-800/20 !text-fuchsia-500 !border !border-fuchsia-800",
  pink: "!bg-pink-800/20 !text-pink-500 !border !border-pink-800",
  rose: "!bg-rose-800/20 !text-rose-500 !border !border-rose-800",
  slate: "!bg-slate-800/20 !text-slate-500 !border !border-slate-800",
  gray: "!bg-gray-800/20 !text-gray-500 !border !border-gray-800",
  zinc: "!bg-zinc-800/20 !text-zinc-500 !border !border-zinc-800",
  neutral: "!bg-neutral-800/20 !text-neutral-500 !border !border-neutral-800",
  stone: "!bg-stone-800/20 !text-stone-500 !border !border-stone-800",
  black: "!bg-black/20 !text-white !border !border-white",
  white: "!bg-white/20 !text-white !border !border-white",
  none: "!bg-transparent !text-text-primary !border !border-component-border"
};

export const badgeXmarkColors = {
  red: "text-red-800 hover:text-red-600",
  orange: "text-orange-800 hover:text-orange-600",
  amber: "text-amber-800 hover:text-amber-600",
  yellow: "text-yellow-800 hover:text-yellow-600",
  lime: "text-lime-800 hover:text-lime-600",
  green: "text-green-800 hover:text-green-600",
  emerald: "text-emerald-800 hover:text-emerald-600",
  teal: "text-teal-800 hover:text-teal-600",
  cyan: "text-cyan-800 hover:text-cyan-600",
  sky: "text-sky-800 hover:text-sky-600",
  blue: "text-blue-800 hover:text-blue-600",
  indigo: "text-indigo-800 hover:text-indigo-600",
  violet: "text-violet-800 hover:text-violet-600",
  purple: "text-purple-800 hover:text-purple-600",
  fuchsia: "text-fuchsia-800 hover:text-fuchsia-600",
  pink: "text-pink-800 hover:text-pink-600",
  rose: "text-rose-800 hover:text-rose-600",
  slate: "text-slate-800 hover:text-slate-600",
  gray: "text-gray-800 hover:text-gray-600",
  zinc: "text-zinc-800 hover:text-zinc-600",
  neutral: "text-neutral-800 hover:text-neutral-600",
  stone: "text-stone-800 hover:text-stone-600",
  black: "text-white hover:text-white",
  white: "text-black hover:text-black",
  none: "text-text-primary"
};

export const darkBadgeXmarkColors = {
  red: "text-red-500 hover:text-red-400",
  orange: "text-orange-500 hover:text-orange-400",
  amber: "text-amber-500 hover:text-amber-400",
  yellow: "text-yellow-500 hover:text-yellow-400",
  lime: "text-lime-500 hover:text-lime-400",
  green: "text-green-500 hover:text-green-400",
  emerald: "text-emerald-500 hover:text-emerald-400",
  teal: "text-teal-500 hover:text-teal-400",
  cyan: "text-cyan-500 hover:text-cyan-400",
  sky: "text-sky-500 hover:text-sky-400",
  blue: "text-blue-500 hover:text-blue-400",
  indigo: "text-indigo-500 hover:text-indigo-400",
  violet: "text-violet-500 hover:text-violet-400",
  purple: "text-purple-500 hover:text-purple-400",
  fuchsia: "text-fuchsia-500 hover:text-fuchsia-400",
  pink: "text-pink-500 hover:text-pink-400",
  rose: "text-rose-500 hover:text-rose-400",
  slate: "text-slate-500 hover:text-slate-400",
  gray: "text-gray-500 hover:text-gray-400",
  zinc: "text-zinc-500 hover:text-zinc-400",
  neutral: "text-neutral-500 hover:text-neutral-400",
  stone: "text-stone-500 hover:text-stone-400",
  black: "text-white hover:text-white",
  white: "text-black hover:text-black",
  none: "text-text-primary"
};

interface BadgeProps {
  content: string | React.ReactNode;
  color: BadgeColor;
  isEditable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  isHover?: boolean;
  fit?: boolean;
}

export default function Badge({ content, color, isEditable = false, onRemove, onClick, className, isHover = false, fit = false }: BadgeProps) {
  const { isDark } = useTheme();

  return (
    <span 
    className={`${isDark ? darkBadgeColors[color] : badgeColors[color]} 
    ${isHover ? "transition-all duration-300 hover:scale-105" : ""}
    px-3 py-1 rounded-md text-sm ${fit ? "" : "flex"} ${className} justify-between`} 
    onClick={onClick}
    >
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