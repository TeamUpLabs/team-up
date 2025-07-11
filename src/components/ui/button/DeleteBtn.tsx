import { TrashBin } from "flowbite-react-icons/outline";

interface DeleteBtnProps {
  handleDelete: () => void;
  text?: string;
  className?: string;
  disabled?: boolean;
  withIcon?: boolean;
}

export default function DeleteBtn({ handleDelete, text = "삭제", className, disabled, withIcon }: DeleteBtnProps) {
  return (
    <button
      onClick={handleDelete}
      className={`${className} flex items-center gap-1 px-4 py-2 text-base 
    font-medium text-white bg-red-500 hover:bg-red-700
    rounded-md transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {withIcon && <TrashBin className="w-4 h-4" />}
      {text}
    </button>
  );
}