import { Check } from "flowbite-react-icons/outline";

interface SubmitBtnProps {
  submitStatus: 'idle' | 'submitting' | 'success' | 'error';
  onClick?: () => void;
  buttonText?: string | React.ReactNode;
  successText?: string;
  errorText?: string;
  className?: string;
  fit?: boolean;
  withIcon?: boolean;
}

export default function SubmitBtn({ submitStatus, onClick, buttonText = "제출", successText = "제출 완료", errorText = "오류 발생", className, fit, withIcon }: SubmitBtnProps) {
  return (
    <div className={`${fit ? "w-fit" : "w-full"}`}>
      <button
        type="submit"
        disabled={submitStatus === 'submitting' || submitStatus === 'error'}
        className={`
        w-full px-4 py-2 rounded-md text-base font-medium
        flex items-center justify-center gap-2
        transition-all duration-300 ease-in-out
        focus:outline-none group
        active:scale-95 cursor-pointer
        ${submitStatus === 'success'
            ? 'bg-point-color-green hover:bg-point-color-green-hover'
            : 'bg-point-color-indigo hover:bg-point-color-indigo-hover'}
        text-white
        ${className}
      `}
        onClick={onClick}
      >
        {submitStatus === 'idle' && (
          <div className="flex items-center gap-1">
            {withIcon && <Check className="w-4 h-4" />}
            {buttonText}
          </div>
        )}
        {submitStatus === 'submitting' && (
          <>
            <svg
              className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            제출중...
          </>
        )}
        {submitStatus === 'success' && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
            {successText}
          </>
        )}
        {submitStatus === 'error' && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {errorText}
          </>
        )}
      </button>
    </div>
  );
}