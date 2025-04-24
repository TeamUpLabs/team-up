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
    gray: "bg-gray-500/20 text-gray-400",
    red: "bg-red-500/20 text-red-400",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
    pink: "bg-pink-500/20 text-pink-400",
    brown: "bg-brown-500/20 text-brown-400",
    teal: "bg-teal-500/20 text-teal-400",
  };

  const badgeXmarkColors = {
    gray: "text-gray-400 hover:text-gray-300",
    red: "text-red-400 hover:text-red-300",
    green: "text-green-400 hover:text-green-300",
    blue: "text-blue-400 hover:text-blue-300",
    yellow: "text-yellow-400 hover:text-yellow-300",
    purple: "text-purple-400 hover:text-purple-300",
    orange: "text-orange-400 hover:text-orange-300",
    pink: "text-pink-400 hover:text-pink-300",
    brown: "text-brown-400 hover:text-brown-300",
    teal: "text-teal-400 hover:text-teal-300",
  };

  return (
    <span className={`${badgeColors[color]} px-3 py-1 rounded-md text-sm`}>
      {content}
      {isEditable && (
        <button
          className={`${badgeXmarkColors[color]} ml-1 focus:outline-none`}
          onClick={onRemove}
          type="button"
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
      )}
    </span>
  );
}