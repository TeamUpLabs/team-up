import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type BadgeColor = "gray" | "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "pink" | "brown" | "teal";

interface BadgeProps {
  content: string;
  color?: BadgeColor;
  isEditable?: boolean;
  onRemove?: () => void;
}

export default function Badge({ content, color = "gray", isEditable = false, onRemove }: BadgeProps) {

  const badgeColors = {
    gray: "bg-gray-500/20 text-gray-500",
    red: "bg-red-500/20 text-red-500",
    green: "bg-green-500/20 text-green-500",
    blue: "bg-blue-500/20 text-blue-500",
    yellow: "bg-yellow-500/20 text-yellow-500",
    purple: "bg-purple-500/20 text-purple-500",
    orange: "bg-orange-500/20 text-orange-500",
    pink: "bg-pink-500/20 text-pink-500",
    brown: "bg-brown-500/20 text-brown-500",
    teal: "bg-teal-500/20 text-teal-500",
  };

  const badgeXmarkColors = {
    gray: "text-gray-500 hover:text-gray-400",
    red: "text-red-500 hover:text-red-400",
    green: "text-green-500 hover:text-green-400",
    blue: "text-blue-500 hover:text-blue-400",
    yellow: "text-yellow-500 hover:text-yellow-400",
    purple: "text-purple-500 hover:text-purple-400",
    orange: "text-orange-500 hover:text-orange-400",
    pink: "text-pink-500 hover:text-pink-400",
    brown: "text-brown-500 hover:text-brown-400",
    teal: "text-teal-500 hover:text-teal-400",
  };

  return (
    <span className={`${badgeColors[color]} px-3 py-1 rounded-md text-sm`}>
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