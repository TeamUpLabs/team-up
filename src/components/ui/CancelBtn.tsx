import { Close } from "flowbite-react-icons/outline";

interface CancelBtnProps {
  handleCancel: () => void;
  className?: string;
  withIcon?: boolean;
}

export default function CancelBtn({ handleCancel, className, withIcon }: CancelBtnProps) {
  return (
    <button
      onClick={handleCancel}
      className={`${className} flex items-center gap-1 px-4 py-2 text-base 
      font-medium text-text-primary bg-cancel-button-background 
      hover:bg-cancel-button-background-hover border border-component-border 
      rounded-lg transition-all duration-300 cursor-pointer`}
    >
      {withIcon && <Close className="w-4 h-4" />}
      취소
    </button>
  );
}