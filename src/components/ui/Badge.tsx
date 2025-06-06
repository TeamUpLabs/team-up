import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type BadgeColor = "gray" | "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "pink" | "zinc" | "teal" | "stone" | "neutral" | "emerald" | "none";

interface BadgeProps {
  content: string | React.ReactNode;
  color: BadgeColor;
  isEditable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export default function Badge({ content, color, isEditable = false, onRemove, onClick, className }: BadgeProps) {

  const badgeColors = {
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
    pink: "bg-pink-100 text-pink-800",
    zinc: "bg-zinc-100 text-zinc-800",
    teal: "bg-teal-100 text-teal-800",
    stone: "bg-stone-100 text-stone-800",
    neutral: "bg-neutral-100 text-neutral-800",
    emerald: "bg-emerald-100 text-emerald-800",
    none: "bg-transparent text-text-primary"
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
    none: "text-text-primary"
  };

  return (
    <span className={`${badgeColors[color]} px-3 py-1 rounded-md text-sm ${className}`} onClick={onClick}>
      {content}
      {isEditable && (
        <button
          className={`${badgeXmarkColors[color]} ml-2 focus:outline-none`}
          onClick={onRemove}
          type="button"
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
      )}
    </span>
  );
}