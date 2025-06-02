import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type BadgeColor = "gray" | "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "pink" | "brown" | "teal";

interface BadgeProps {
  content: string | React.ReactNode;
  color?: BadgeColor;
  isEditable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export default function Badge({ content, color = "gray", isEditable = false, onRemove, className }: BadgeProps) {

  const badgeColors = {
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
    pink: "bg-pink-100 text-pink-800",
    brown: "bg-brown-100 text-brown-800",
    teal: "bg-teal-100 text-teal-800",
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
    brown: "text-brown-800 hover:text-brown-600",
    teal: "text-teal-800 hover:text-teal-600",
  };

  return (
    <span className={`${badgeColors[color]} px-3 py-1 rounded-md text-sm ${className}`}>
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